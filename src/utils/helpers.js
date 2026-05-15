export const stripSuffix = (value = "", suffix = "") =>
  value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;

export const isExpiringSoon = (expiresAt) => {
  if (!expiresAt) return false;
  const parts = expiresAt.split("/").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return false;
  const [d, m, y] = parts;
  const diff = new Date(y, m - 1, d) - new Date();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
};
