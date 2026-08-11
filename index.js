require('dotenv').config();
const express = require('express');
const axios = require('axios');
const auth = require('./firebaseAdmin');   // now imports the auth instance directly

const app = express();
app.use(express.json());

// Register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await auth.createUser({ email, password });
    res.status(201).json({ message: 'User registered', uid: userRecord.uid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );
    res.json({ message: 'Login successful', idToken: response.data.idToken });
  } catch (err) {
    res.status(400).json({ error: err.response?.data?.error?.message || 'Login failed' });
  }
});

// Protected route
app.get('/api/profile', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = await auth.verifyIdToken(token);
    res.json({ message: `Welcome ${decoded.email}, you are authenticated!` });
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));