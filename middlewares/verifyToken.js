const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  if (['/login', '/register'].includes(req.path)) return next();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
