const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // ✅ corrected
const protect = require('./middlewares/authMiddleware'); // ✅ middleware path fixed

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/stocksathi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Sample Protected Route
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

app.get('/', (req, res) => {
  res.send('Server is up & running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
