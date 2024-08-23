const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(bodyParser.json());

// Initialize the database
db.serialize(() => {
    db.run("CREATE TABLE students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, area_of_interest TEXT, availability TEXT)");
    db.run("CREATE TABLE mentors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, areas_of_expertise TEXT, is_premium BOOLEAN, availability TEXT)");
    db.run("CREATE TABLE bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER, mentor_id INTEGER, duration INTEGER, start_time TEXT, FOREIGN KEY(student_id) REFERENCES students(id), FOREIGN KEY(mentor_id) REFERENCES mentors(id))");
});

// API Routes
app.get('/mentors', (req, res) => {
    db.all("SELECT * FROM mentors", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.post('/bookings', (req, res) => {
    const { student_id, mentor_id, duration, start_time } = req.body;
    const stmt = db.prepare("INSERT INTO bookings (student_id, mentor_id, duration, start_time) VALUES (?, ?, ?, ?)");
    stmt.run(student_id, mentor_id, duration, start_time, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID });
        }
    });
    stmt.finalize();
});

app.get('/bookings', (req, res) => {
    db.all("SELECT * FROM bookings", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
