const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.post('/add-flight', (req, res) => {
    const { airline, origin, destination, departure_time, available_seats, price } = req.body;

    db.run(
        "INSERT INTO flights (airline, origin, destination, departure_time, available_seats, price) VALUES (?, ?, ?, ?, ?, ?)",
        [airline, origin, destination, departure_time, available_seats, price],
        function (err) {
            if (err) return res.status(500).json({error: err.message });
            res.json({ flight_id: this.lastID, message: "Flight Added Successfully"});
        }
    );
});

module.exports = router;