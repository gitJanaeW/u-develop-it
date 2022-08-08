const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const mysql = require('mysql2');

// Express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
const db = mysql.createConnection(
    {
        host: 'localhost',
        // my MySQL username
        user: 'root',
        // my MySQL password
        password: 'Omghackfr33_',
        database: 'election'
    },
    console.log('Connected to the election database')
);

// queries the db var and should return all of the rows
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

// to select a single row
db.query(`SELECT * FROM candidates WHERE id= 1`, (err, row) => {
    if (err) {
        console.log(err);
    }
    console.log(row);
});

// Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
    VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];
db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

// Default for any other requests (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});

// to delete a single row
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });