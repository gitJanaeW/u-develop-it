
const mysql = require('mysql2');

const db = mysql.createConnection({
        host: 'localhost',
        // my MySQL username
        user: 'root',
        // my MySQL password
        password: 'Omghackfr33_',
        database: 'election'
    },
    console.log('Connected to the election database')
);

module.exports = db;