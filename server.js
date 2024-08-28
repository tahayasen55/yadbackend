const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const supplicationRouter = require('./Controller/supplicationController'); 

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware

// Explicitly set CORS for Chrome extension
const corsOptions = {
  origin: 'chrome-extension://jljokbkdniojnikdnhajdgihmgfalhao', // Replace with your actual extension ID
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Use the supplication routes
app.use('/api/supplications', supplicationRouter);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
