const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);

const listingRoutes = require('./routes/listings');

app.use('/api/listings', listingRoutes);

const userRoutes = require('./routes/users');

app.use('/api/users', userRoutes);

const conversationRoutes = require('./routes/conversations');

app.use('/api/conversations', conversationRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req,res) =>{
    res.json({message:'Colivr API is running!'});
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    pool.query('SELECT NOW()', (err,res) => {
    if(err){
        console.error('Error connecting to the database', err);
    }else{
        console.log('Database Connected at', res.rows[0].now);
    }
});
});


setInterval(() => {}, 1000 * 60 * 60);