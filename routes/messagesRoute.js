// routes/messages.js
const express = require('express');
const router = express.Router();
const { createMessage, verifyMessage } = require('../controllers/messageController');


router.post('/create', createMessage);

// GET /api/messages/verify/:messageId - Verify message via email link
router.get('/verify/:messageId', verifyMessage);

// Optional: GET /api/messages - Get all verified messages (for admin)
router.get('/', async (req, res) => {
  try {
    const Message = require('../models/Message');
    const messages = await Message.find({ isVerified: true }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      messages
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
});

// Optional: DELETE /api/messages/:id - Delete a message (for admin)
router.delete('/:id', async (req, res) => {
  try {
    const Message = require('../models/Message');
    const { id } = req.params;
    
    const deletedMessage = await Message.findByIdAndDelete(id);
    
    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message'
    });
  }
});

module.exports = router;