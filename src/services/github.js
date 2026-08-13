const GITHUB_API = 'https://api.github.com';
const DATA_PATH = 'data/app-data.json';

export function getConfig() {
  return {
    token: localStorage.getItem('gh_token') || '',
    owner: localStorage.getItem('gh_owner') || '',
    repo: localStorage.getItem('gh_repo') || '',
  };
}

export function setConfig({ token, owner, repo }) {
  localStorage.setItem('gh_token', token);
  localStorage.setItem('gh_owner', owner);
  localStorage.setItem('gh_repo', repo);
}

export function isConfigured() {
  const { token, owner, repo } = getConfig();
  return !!(token && owner && repo);
}

async function apiRequest(path, options = {}) {
  const { token } = getConfig();
  const response = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Safe base64 encode that handles Unicode / Chinese characters
function b64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function b64Decode(str) {
  return decodeURIComponent(escape(atob(str.replace(/\n/g, ''))));
}

const DEFAULT_DATA = {
  checkins: [],
  deadlines: [],
  travels: [],
};

// In-memory SHA cache so we can update the file
let _dataSha = null;

export async function loadData() {
  if (!isConfigured()) return null;
  const { owner, repo } = getConfig();

  try {
    const result = await apiRequest(`/repos/${owner}/${repo}/contents/${DATA_PATH}`);
    _dataSha = result.sha;
    return JSON.parse(b64Decode(result.content));
  } catch (error) {
    // Handle: file not found (404) OR repo is completely empty (409 / "Git Repository is empty")
    const msg = error.message || ''
    if (
      msg === 'Not Found' ||
      msg.includes('404') ||
      msg.includes('409') ||
      msg.toLowerCase().includes('empty') ||
      msg.toLowerCase().includes('git repository is empty')
    ) {
      // First run – create the data file (this also makes the first commit)
      await saveData(DEFAULT_DATA)
      return DEFAULT_DATA
    }
    throw error
  }
}

export async function saveData(data) {
  if (!isConfigured()) throw new Error('GitHub 未配置');
  const { owner, repo } = getConfig();

  const body = {
    message: `chore: update app data ${new Date().toISOString()}`,
    content: b64Encode(JSON.stringify(data, null, 2)),
  };
  if (_dataSha) body.sha = _dataSha;

  const result = await apiRequest(`/repos/${owner}/${repo}/contents/${DATA_PATH}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  _dataSha = result.content.sha;
  return result;
}

// ─── Photo helpers ────────────────────────────────────────────────────────────

export async function uploadPhoto(photoId, file) {
  if (!isConfigured()) throw new Error('GitHub 未配置');
  const { owner, repo } = getConfig();

  const compressed = await compressImage(file, 1200, 0.82);
  const base64 = await fileToBase64(compressed);

  await apiRequest(`/repos/${owner}/${repo}/contents/data/photos/${photoId}.jpg`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `feat: add photo ${photoId}`,
      content: base64,
    }),
  });
}

export async function getPhotoDataUrl(photoId) {
  if (!isConfigured()) return null;

  // Check localStorage cache first
  const cached = localStorage.getItem(`photo_cache_${photoId}`);
  if (cached) return cached;

  const { owner, repo } = getConfig();
  try {
    const result = await apiRequest(
      `/repos/${owner}/${repo}/contents/data/photos/${photoId}.jpg`
    );
    const dataUrl = `data:image/jpeg;base64,${result.content.replace(/\n/g, '')}`;
    try {
      localStorage.setItem(`photo_cache_${photoId}`, dataUrl);
    } catch {
      // localStorage full – skip caching
    }
    return dataUrl;
  } catch {
    return null;
  }
}

// ─── Image utilities ──────────────────────────────────────────────────────────

function compressImage(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    img.src = url;
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}