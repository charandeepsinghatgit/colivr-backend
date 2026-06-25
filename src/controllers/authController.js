const pool = require ('../db');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res ) =>{
    const{ first_name, email, password} = req.body;
    if (!first_name || !email || !password){
        return res.status(400).json({error: 'All fields are required'});
    }
    try{
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (userExists.rows.length > 0){
            return res.status(400).json ({error: ' Email already registered'});
        }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users ( first_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, first_name, email, created_at',
            [first_name, email, password_hash]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0]
        });

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password){
        return res.status(400).json({error: 'All fields are required!'});
    }

    try{
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );

        if(user.rows.length === 0){
            return res.status(400).json({error: 'Invalid credentials!'});
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password_hash
        );
        if(!validPassword){
            return res.status(400).json({error: 'Invalid credentials!'});
        }

        const token = jwt.sign(
            {id:user.rows[0].id, email: user.rows[0].email},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user:{
                id: user.rows[0].id,
                first_name: user.rows[0].first_name,
                email: user.rows[0].email

            }
        });
    }catch(error){
        console.error(error)
        res.status(500).json({error: 'Server error'})
    }
}

module.exports= {register, login};