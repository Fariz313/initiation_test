const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./module/builder.query');
const User = require('./module/library.user');
const bodyParser = require('body-parser');


const app = express();

// Define the secret key used to generate JWTs
const secretKey = process.env.SECRET_KEY;
const { pool } = require('./config/db.config');

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Create a login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve user from the database
    const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
    const user = rows[0];

    // Verify the user's credentials
    if (!user || password !== user.password) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Generate a JWT
    const token = jwt.sign(
      {
        username,
        role: user.role, // Assuming your user table has a 'role' column
      },
      secretKey,
      {
        expiresIn: '1h',
      }
    );

    // Return the JWT to the user
    res.json({
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

app.post('/login/dev', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve user from the database
    const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
    const user = rows[0];

    // Verify the user's credentials
    if (!user || password !== user.password) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Generate a JWT
    const token = jwt.sign(
      {
        username,
        role: user.role, // Assuming your user table has a 'role' column
      },
      secretKeyDev,
      {
        expiresIn: '1h',
      }
    );

    // Return the JWT to the user
    res.json({
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

// Create a registration endpoint
app.post('/register', async (req, res) => {
  let reqBody = req.body;

  // if (!username || !password) {
  //   return res.status(400).json({
  //     message: 'Username and password are required',
  //   });  
  // }

  // Check if the username already exists
  // if (users[username]) {
  //   return res.status(400).json({
  //     message: 'Username is already taken',
  //   });
  // }

  // Hash the password before storing it
  reqBody.password = await User.hashPassword(reqBody.password);
  // Store the user in the database
  await db.insert('users',reqBody);

  res.status(201).json({
    message: 'User registered successfully',
  });
});

// Create a protected endpoint
app.get('/protected', async (req, res) => {
  // Verify the user's JWT
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, secretKey);
    if (!decodedToken) {
      return res.status(401).json({
        message: 'Invalid JWT',
      });
    }

    // The user is authenticated
    res.json({
      message: 'Welcome to the protected endpoint!',
    });
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid JWT',
    });
  }
});

// Start the server
app.listen(process.env.APP_PORT, () => {
  console.log('Server is listening on port ' + process.env.APP_PORT);
});
