import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.users.create({
      data: {
        email,
        name,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error creating user. Email may already exist.' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  const users = await prisma.users.findMany();
  res.json(users);
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(id) },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name } = req.body;
  try {
    const user = await prisma.users.update({
      where: { id: Number(id) },
      data: {
        email,
        name,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found or error updating' });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});