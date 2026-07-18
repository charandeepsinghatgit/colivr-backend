const pool = require('../db');

const userProfile = async(req, res ) =>{
    try{
        const user = await pool.query(
            'SELECT id, first_name, email, created_at FROM users WHERE id = $1',
            [req.user.id]
        )

        if(user.rows.length === 0 ){
            return res.status(404).json({error:'User not found'});
        }
        res.status(200).json({user:user.rows[0]});
    }catch(error){
        console.error(error);
        res.status(500).json({error:'Server error'});
    }
}

const updateUser = async (req, res) => {
    try{
        const {first_name} = req.body;
        
        if(!first_name){
            return res.status(400).json({message:'First name is required'});
        }
        const updated = await pool.query(
            'UPDATE users SET first_name = $1 WHERE id = $2 RETURNING id, first_name, email, created_at', [first_name, req.user.id]
        );
        res.status(200).json({user: updated.rows[0]});
    }catch(error){
        console.error(error);
        res.status(500).json({error:'Server error'});
    }
}

module.exports = {userProfile, updateUser};