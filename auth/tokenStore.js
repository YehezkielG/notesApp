const tokens = new Map(); // token -> { email, expires }

export function saveToken(token, email, ttlMs) {
  tokens.set(token, { email, expires: Date.now() + ttlMs });
}

export function consumeToken(token) {
  const data = tokens.get(token);
  if (!data) return null;
  if (Date.now() > data.expires) {
    tokens.delete(token);
    return null;
  }
  tokens.delete(token);
  return data.email;
}
