require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// // Register route
// app.post('/register', async (req, res) => {
//   const { email, password } = req.body;
//   const existing = await prisma.user.findUnique({ where: { email } });

//   if (existing) {
//     return res.status(400).json({ message: 'Email already registered' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await prisma.user.create({
//     data: { email, password: hashedPassword },
//   });

//   res.status(201).json({ message: 'User registered', userId: user.id });
// });

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password)
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  
  if (password !== user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  console.log('✅ Login successful');
  res.status(200).json({ message: 'Login successful' });
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});


app.post('/api/dailyupdate', async (req, res) => {
  const { title, description, date } = req.body;

  try {
    const newUpdate = await prisma.dailyUpdate.create({
      data: {
        title,
        description,
        date: new Date(date), 
      },
    });

    res.status(201).json({
      message: 'Daily update created successfully!',
      data: newUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
});


app.get('/api/dailyupdate', async (req, res) => {
  try {
    const updates = await prisma.dailyUpdate.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ message: 'Error fetching daily updates' });
  }
});

