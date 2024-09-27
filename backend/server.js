const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'expense_tracker'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Posting to db expenses table
app.post('/api/expenses', (req, res) => {
    const { expense_name, category, payment_method, amount } = req.body;
    console.log(`Received Expense: ${expense_name}, ${category}, ${payment_method}, ${amount}`);
    const query = 'INSERT INTO expenses (expense_name, category, payment_method, amount, date) VALUES (?, ?, ?, ?, ?)';
    const values = [expense_name, category, payment_method, amount, new Date()];
    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error inserting expense:', error);
            res.status(500).json({ error: 'Failed to add expense' });
        } else {
            console.log('Insert Results:', results);
            res.status(201).json({ message: 'Expense added successfully!' });
        }
    });
});

// Fetch expenses from the database (adjust column names as necessary)
app.get('/api/expenses', (req, res) => {
    connection.query('SELECT id, expense_name, category, payment_method, amount, date FROM expenses', (err, results) => {
        if (err) {
            console.error('Error fetching expenses:', err);
            res.status(500).json({ error: 'Error fetching expenses' });
        } else {
            res.json(results);
        }
    });
});

// Delete an expense
app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM expenses WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error deleting expense:', error);
            res.status(500).json({ error: 'Failed to delete expense' });
        } else {
            res.status(204).send(); // No content
        }
    });
});


// Categories API
app.get('/api/categories', (req, res) => {
    connection.query('SELECT id, name FROM categories', (error, results) => {
        if (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Error fetching categories' });
        } else {
            res.json(results);
        }
    });
});

// Payment Methods API
app.get('/api/payment-methods', (req, res) => {
    connection.query('SELECT id, method FROM payment_methods', (error, results) => {
        if (error) {
            console.error('Error fetching payment methods:', error);
            res.status(500).json({ error: 'Error fetching payment methods' });
        } else {
            res.json(results);
        }
    });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
