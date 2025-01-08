// Import required modules
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Configure database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve patients' });
    }
    res.json(results);
  });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve providers' });
    }
    res.json(results);
  });
});

// Question 3: Filter patients by First Name
app.get('/patients/filter', (req, res) => {
  const { first_name } = req.query; // Pass first_name as a query parameter
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [first_name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to filter patients by first name' });
    }
    res.json(results);
  });
});

// Question 4: Retrieve all providers by their specialty
app.get('/providers/filter', (req, res) => {
  const { specialty } = req.query; // Pass specialty as a query parameter
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve providers by specialty' });
    }
    res.json(results);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
