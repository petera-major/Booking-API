const express= require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/search-flights', (req, res) => {
    const { origin, destination, date } = req.query;

    let query = "SELECT * FROM flights WHERE available_seats > 0";
    let params = [];

    if (origin) {
        query += " AND origin LIKE ?";
        params.push(`%${origin}%`);
    }
    if (destination) {
        query += " AND destination LIKE ?";
        params.push(`%${destination}%`);
    }
    if (date) {
        query += " AND DATE(departure_time) = ?";
        params.push(date);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


app.post('/book', (req, res) => {
    const { user_id, flight_id, seat_number } = req.body;
    db.run(
        "INSERT INTO bookings (user_id, flight_id, seat_number, status) VALUES (?, ?, ?, 'Pending')",
        [user_id, flight_id, seat_number],
        function (err) {
            if (err) return res.status(500).json({ error: err.message});
            res.json({ booking_id: thislastID, message: "Booking Pending" });
        }
    );
});

app.post('/confirm', (req, res) => {
    const { booking_id } = req.body;
    db.run("UPDATE bookings SET status = 'Confirmed' WHERE id=?", [booking_id], (err) => {
            if (err) return res.status(500).json({ error: err.message});
            res.json({ message: "Booking Confirmed!" });
        }
    );
});

app.post('/cancel', (req, res) => {
    const { booking_id } = req.body;
    db.run("UPDATE bookings SET status = 'Cancelled' WHERE id=?", [booking_id], (err) => {
            if (err) return res.status(500).json({ error: err.message});
            res.json({ message: "Booking Cancelled." });
        }
    );
});


app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`); 
});