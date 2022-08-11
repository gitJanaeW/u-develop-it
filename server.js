const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const db = require('./db/connection');
const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
// direct server to the routes/apiRoutes/index.js file (which acts as a hub for all endpoints)
app.use('/api', apiRoutes);
// Default for any other requests (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    // start server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}.`);
    });
})
