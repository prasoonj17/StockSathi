const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tenantMiddleware = (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId;
  if (!tenantId) {
    return res.status(400).json({ message: 'Tenant ID missing' });
  }
  req.tenantId = tenantId;
  next();
};

module.exports = tenantMiddleware; // ✅