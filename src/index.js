const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const pool = require('./db');

pool.query('SELECT NOW()', (err,res) => {
    if(err){
        console.error('Error connecting to the database', err);
    }else{
        console.log('Database Connected at', res.rows[0].now);
    }
});

const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message : 'Colivr API is running'});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

