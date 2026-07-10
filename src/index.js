const express = require('express');
const dotenv = require('dotenv');

const protect = require("./middleware/auth");

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

const PORT = process.env.PORT || 3000;


app.get('/api/protected', protect, (req, res)=>{
    res.json({message:`Hello ${req.user.email}, You are authorized!`})
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

