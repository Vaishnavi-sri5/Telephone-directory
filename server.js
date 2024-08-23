const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // use your MySQL username
    password: 'password', // use your MySQL password
    database: 'telephone_directory'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// API routes

// Add a new contact
app.post('/add-contact', (req, res) => {
    const { name, phoneNumbers, address, emails } = req.body;
    const query = `INSERT INTO contacts (name, phoneNumbers, address, emails) VALUES (?, ?, ?, ?)`;
    db.query(query, [name, phoneNumbers.join(', '), address, emails.join(', ')], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Server error');
            return;
        }
        res.send('Contact added successfully!');
    });
});

// Search contacts
app.get('/search-contacts', (req, res) => {
    const query = req.query.q;
    const searchQuery = `
        SELECT * FROM contacts WHERE 
        name LIKE ? OR 
        phoneNumbers LIKE ? OR 
        address LIKE ? OR 
        emails LIKE ?
    `;
    const searchValue = `%${query}%`;

    db.query(searchQuery, [searchValue, searchValue, searchValue, searchValue], (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
