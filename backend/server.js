require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// --- GET ALL EMPLOYEES ---
app.get('/api/employee', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// --- SEARCH EMPLOYEES (Matches your frontend call) ---
app.get('/api/employee/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    // If no search query, return all
    if (!q) {
      const allEmployees = await prisma.employee.findMany();
      return res.json(allEmployees);
    }

    // Search by name OR email (case-insensitive)
    const employees = await prisma.employee.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } }
        ]
      }
    });
    
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search employees' });
  }
});

// --- ADD A NEW EMPLOYEE ---
app.post('/api/employee', async (req, res) => {
  try {
    const { name, email, position, salary } = req.body; // Adjust these to match your Prisma schema
    
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        position,
        salary: parseFloat(salary) // Ensure salary is a number if your DB requires it
      }
    });
    
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// --- UPDATE AN EMPLOYEE ---
app.put('/api/employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, position, salary } = req.body;
    
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        position,
        salary: parseFloat(salary)
      }
    });
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// --- DELETE AN EMPLOYEE ---
app.delete('/api/employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.employee.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Start server locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// CRITICAL: Export for Vercel
module.exports = app;
