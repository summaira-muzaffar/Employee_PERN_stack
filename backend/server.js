require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// --- YOUR ROUTES GO HERE ---
// Note: Make sure all your routes start with '/api' so the Vercel rewrites work.

// Example GET route (Replace with your actual employee routes)
app.get('/api/employee', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Example search route (Replace with your actual search logic)
app.get('/api/employee/search', async (req, res) => {
  // Your search logic here
});

// --- END OF ROUTES ---

// Start the server locally only (Vercel handles this in production)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// CRITICAL: Export the app for Vercel
module.exports = app;
