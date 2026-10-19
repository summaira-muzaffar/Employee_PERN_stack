require('dotenv').config();
const express = require('express');

const cors = require('cors');

const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET ALL
app.get('/api/employee', async (req, res) => {
  try {
    const employees = await prisma.employee_details.findMany();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// SEARCH
app.get('/api/employee/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      const allEmployees = await prisma.employee_details.findMany();
      return res.json(allEmployees);
    }

    const employees = await prisma.employee_details.findMany({
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

// ADD
app.post('/api/employee', async (req, res) => {
  try {
    const { name, email, age, role, salary } = req.body; 
    const newEmployee = await prisma.employee_details.create({
      data: {
        name,
        email,
        age: parseInt(age),
        role,
        salary: parseFloat(salary)
      }
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create employee. Check unique email or valid role.' });
  }
});

// UPDATE
app.put('/api/employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age, role, salary } = req.body;
    const updatedEmployee = await prisma.employee_details.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        age: parseInt(age),
        role,
        salary: parseFloat(salary)
      }
    });
    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE
app.delete('/api/employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.employee_details.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Local server start
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel ke liye export (Zaroori hai)
module.exports = app;
