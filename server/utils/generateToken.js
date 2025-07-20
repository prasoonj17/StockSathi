const jwt = require('jsonwebtoken');

const generateToken = (userId, tenantId) => {
  return jwt.sign({ userId, tenantId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;

