//const jwt = require('jsonwebtoken');
//const User = require('../models/User');

//const protect = async (req, res, next) => {
//  try {
//    const token = req.headers.authorization?.split(' ')[1];
//    if (!token) return res.status(401).json({ message: 'No token provided' });

//    const decoded = jwt.verify(token, 'process.env.JWT_SECRET');
//    const user = await User.findById(decoded.id).select('-password');

//    if (!user) return res.status(404).json({ message: 'User not found' });

//    req.user = user;
//    next();
//  } catch (err) {
//    res.status(401).json({ message: 'Unauthorized', error: err.message });
//  }
//};

//module.exports = protect;


const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, tenantId }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
