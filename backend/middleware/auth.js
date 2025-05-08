import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next(); // allow guest access, but req.user is null
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findById(decoded.userId);
    if (!user) {
      req.user = null;
      return next();
    }
    req.user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    };
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}
