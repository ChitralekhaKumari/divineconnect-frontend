// Small localStorage helpers that power "Recently Played" and
// "Continue Listening" without needing a database table.
// Everything here is scoped to this browser only (per requirement #8/#10,
// which allow localStorage as the storage layer for these two features).

const RECENT_KEY = 'dc_bhajan_recent';
const PROGRESS_KEY = 'dc_bhajan_progress';
const RECENT_LIMIT = 12;

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can throw in private-browsing / quota-exceeded cases —
    // fail silently, the app still works, it just won't persist.
  }
}

// ─── Recently played ────────────────────────────────────────────────────────
export function getRecentlyPlayed() {
  return readJSON(RECENT_KEY, []);
}

export function addRecentlyPlayed(bhajan) {
  const list = getRecentlyPlayed().filter((b) => b.id !== bhajan.id);
  list.unshift({
    id: bhajan.id,
    title: bhajan.title,
    deity: bhajan.deity,
    singer: bhajan.singer,
    cover_image: bhajan.cover_image,
    duration_seconds: bhajan.duration_seconds,
    playedAt: Date.now(),
  });
  writeJSON(RECENT_KEY, list.slice(0, RECENT_LIMIT));
}

// ─── Continue listening (playback position per bhajan) ─────────────────────
export function getAllProgress() {
  return readJSON(PROGRESS_KEY, {});
}

export function getProgress(id) {
  const all = getAllProgress();
  return all[id] || 0;
}

export function saveProgress(id, seconds) {
  const all = getAllProgress();
  all[id] = seconds;
  writeJSON(PROGRESS_KEY, all);
}

export function clearProgress(id) {
  const all = getAllProgress();
  delete all[id];
  writeJSON(PROGRESS_KEY, all);
}

// Returns entries worth showing under "Continue Listening": tracks with
// meaningful progress that haven't finished yet.
export function getContinueListening(bhajansById) {
  const all = getAllProgress();
  return Object.entries(all)
    .map(([id, seconds]) => ({ bhajan: bhajansById[id], seconds }))
    .filter(({ bhajan, seconds }) => bhajan && seconds > 5 && seconds < bhajan.duration_seconds - 5)
    .sort((a, b) => b.seconds - a.seconds);
}
