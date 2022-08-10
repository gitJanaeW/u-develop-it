const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

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

// get all candidates
app.get('/api/candidates', (req, res) => {
    sql = `SELECT candidates.*, parties.name
        AS party_name FROM candidates
        LEFT JOIN parties ON
        candidates.party_id = parties.id;`
    // queries the db var and returns all of the rows
    db.query(sql, (err, rows) => {
        if (err){
            // REMEMBER 500 indicates a server error
            res.status(500).json({error: err.message});
            return;
        }
        res.json({message: 'success', data: rows});
    });
});

// get a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
        AS party_name FROM candidates
        LEFT JOIN parties ON
        candidates.party_id = parties.id
        WHERE candidates.id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({message: 'success', data: row});
    });
});

// get all parties
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({message: 'success', data: rows});
    });
});

// get a single party
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({message: 'success', data: row});
    });
});

// change a candidates party
app.put('/api/candidate/:id', (req, res) => {
    const sql = `UPDATE candidates SET party_id = ? WHERE id = ?`;
    // first param is the `party_id = ?` value. second is the `id = ?` value
    // to check if user provided valid input
    errors = inputCheck(req.body, 'party_id');
    if(errors) {
        res.status(400).json({errors: errors});
        return;
    }
    const params = [req.body.party_id, req.params.id];
    console.log("REQ.BODY.PARTY_ID: ", req.body.party_id);
    console.log("REQ.PARAMS.ID: ", req.params.id);
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({error: err.message});
        }// !affectedRows: letting you know whether or not something was selected for deletion
        else if (!result.affectedRows) {
            res.json({message: 'Candidate no found'});
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// Delete a candiate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({error: res.message});
        } // !affectedRows: letting you know whether or not something was selected for deletion
        else if (!result.affectedRows) {
            res.json({message: 'Candidate not found'});
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Create a candidate
// the {body} will just pull the body out of the req response, instead of the entire req object. Instead of "req.body", we can write "body"
app.post('/api/candidate', ({body}, res) => {
    console.log(body);
    // checking for missing info fields using the inputCheck from utils/inputCheck.js
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        })
    });
});

app.delete('api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({error: message});
            return;
        } // !affectedRows: letting you know whether or not something was selected for deletion
        else if (!result.affectedRows) {
            res.json({message: 'Party not found'});
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
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

// to select a single row
// db.query(`SELECT * FROM candidates WHERE id= 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//     VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });