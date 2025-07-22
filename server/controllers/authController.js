const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup Controller
exports.signup = async (req, res) => {

  console.log("req",req.body);
  try {
    const { name, email, password, shopName, address } = req.body;
    const tenantId = Math.random().toString(36).substring(2, 10); // Example ID

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      shopName,
      address,
      password: hashedPassword,
      tenantId, // ✅ Add this line
    });

    const token = jwt.sign({ id: newUser._id,tenantId: newUser.tenantId }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
console.log(token);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.log('Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id ,tenantId:user.tenantId}, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
