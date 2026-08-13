const pool = require('../db');

const getOrCreateConversation = async (req, res) => {
    const {listing_id, receiver_id} = req.body;
    const sender_id = req.user.id;

    try{
        const existing = await pool.query(
            'SELECT * FROM conversations WHERE listing_id = $1 AND receiver_id = $2 AND sender_id = $3',
            [listing_id, receiver_id, sender_id]
        )

        if(existing.rows.length > 0){
            return res.status(200).json({conversation : existing.rows[0]});
        }

        const newConversation = await pool.query(
            'INSERT INTO conversations (listing_id, receiver_id, sender_id) VALUES ($1, $2, $3) RETURNING *',
            [listing_id, receiver_id, sender_id] 
        )

        res.status(201).json({conversation: newConversation.rows[0]});

    }catch(error){
        res.status(500).json({error:'Server error'});
    }
};

const getConversations = async (req, res) => {
    const user_id = req.user.id;
    try{
        const conversations = await pool.query(
            'SELECT * FROM conversations WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created_at DESC',
            [user_id]
        )

        res.status(200).json({conversations: conversations.rows});
    }catch(error){
        res.status(500).json({error:'Server error'})
    }
 };

 const sendMessage = async (req, res) => {
    const {id} = req.params;
    const {content} = req.body;
    const sender_id = req.user.id;

    try{
        const message = await pool.query(
            'INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
            [id, sender_id, content]
        );
        res.status(201).json({message: message.rows[0]});
    }catch(error){
        res.status(500).json({error: 'Server error'});
    }
 };

 const getMessages = async (req, res) => {
    const {id} = req.params;

    try{
        const messages = await pool.query(
            'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC', [id]
        );
        res.status(200).json({messages: messages.rows});
    }catch(error){
        res.status(500).json({error: 'Server error'});
    }
 }

module.exports = {getOrCreateConversation, getConversations, sendMessage, getMessages};