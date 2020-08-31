const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    next(new Error('Not Authenticated'));
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.userId = verified.user_id;
  } catch {
    next(new Error('Authentication Failed'));
    return;
  }
  next();
}