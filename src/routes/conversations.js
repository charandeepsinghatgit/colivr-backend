const express = require ('express');
const router =  express.Router()
const protect = require ('../middleware/auth');
const {
    getOrCreateConversation,
    getConversations,
    sendMessage,
    getMessages
} = require ('../controllers/conversationController');

router.post('/', protect, getOrCreateConversation);
router.get('/', protect, getConversations);
router.post('/:id/messages', protect, sendMessage);
router.get('/:id/messages', protect, getMessages);

module.exports = router; 