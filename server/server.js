const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB=require('./config/db');  //fiir connecting database and showing data inside the database
const authRoutes = require('./routes/authRoutes'); // ✅ corrected
const protect = require('./middlewares/authMiddleware'); // ✅ middleware path fixed
const path=require('path');
const dotenv=require('dotenv');
const productroute=require('./routes/product.routes')

dotenv.config();
connectDB();








const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());


// Routes for user login/signup
app.use('/api/auth', authRoutes);

//routes for product module
app.use('/api/product',productroute);
app.use('/barcodes', express.static(path.join(__dirname, 'barcodes')));

// Sample Protected Route
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

app.get('/', (req, res) => {
  res.send('Server is up & running');
});

app.listen(PORT, () => {
  console.log(` 🚀 Server running on port https://localhost:${PORT}`);
});
