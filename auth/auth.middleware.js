// Cek JWT, ngeblock request kalo token salah atau expired

const jwt = require('jsonwebtoken');
require('dotenv').config();

function getToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null
}

function extractUserId(payload) {
  return (
    payload?.id ??
    payload?.userId ??
    payload?.uid ??
    payload?.sub ??
    null
  );
}

function requireAuth(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const userId = extractUserId(payload);
    if (userId == null) {
      return res.status(401).json({ message: 'Unauthorized: token payload missing user id' });
    }

    // pastikan selalu ada req.user.id
    req.user = { ...payload, id: userId };

    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
