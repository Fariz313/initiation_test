const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const port = 4000;

// Define the secret key used to verify JWTs
const secretKey = 'my-secret-key';

// Middleware to verify JWT before accessing protected endpoints
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing Token' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
  }
};

// Protected endpoint in the resource service
app.get('/resource', authenticateJWT, (req, res) => {
  // Access the authenticated user's information
  const { username, role } = req.user;

  // Perform actions specific to the resource service
  res.json({
    message: `Welcome, ${username}! You have access to the protected resource.`,
    role,
  });
});

// Example endpoint that interacts with the authentication service to get user information
app.get('/user-info', authenticateJWT, async (req, res) => {
  const { username } = req.user;

  // In a real-world scenario, you might want to make an API call to the authentication service
  // to fetch additional information about the user (e.g., user profile details).
  try {
    const response = await axios.get('http://localhost:3000/user-info', {
      headers: {
        Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching user information:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Resource service listening at http://localhost:${port}`);
});
