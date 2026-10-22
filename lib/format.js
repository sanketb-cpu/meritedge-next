export const fill = (text, vars = {}) =>
  String(text).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));

export const firstName = (name) => (name || '').trim().split(/\s+/)[0] || 'there';

export const initials = (name) =>
  (name || '?').trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase();
