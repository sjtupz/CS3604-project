const cache = new Map();

function getCachedTrainsQuery(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCachedTrainsQuery(key, value, ttlSeconds = 900) {
  const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
  cache.set(key, { value, expiresAt });
  return true;
}

function invalidateCachedTrainsQuery(key) {
  cache.delete(key);
  return true;
}

module.exports = {
  getCachedTrainsQuery,
  setCachedTrainsQuery,
  invalidateCachedTrainsQuery,
};
