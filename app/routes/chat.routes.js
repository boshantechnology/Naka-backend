const express = require('express');
const router = express.Router();
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');
const { protect } = require('../middlewares/auth.middleware');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

// Get all chats for current user
/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Get all chats for the current user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chats
 */
router.get('/', protect, asyncHandler(async (req, res) => {
    const chats = await Chat.find({ participants: req.user._id })
        .populate('participants', 'name profile_image role')
        .populate('last_message')
        .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: chats });
}));

// Get messages for a specific chat
/**
 * @swagger
 * /chat/{chatId}/messages:
 *   get:
 *     summary: Get messages for a specific chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat ID
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/:chatId/messages', protect, asyncHandler(async (req, res) => {
    const messages = await Message.find({ chat_id: req.params.chatId })
        .sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: messages });
}));

// Create a new chat (or get existing)
/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Create or retrieve a chat with another user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to chat with
 *     responses:
 *       200:
 *         description: Chat session details
 */
router.post('/', protect, asyncHandler(async (req, res) => {
    const { userId } = req.body; // Target user to chat with

    if (!userId) return res.status(400).json({ success: false, message: 'UserId required' });

    let chat = await Chat.findOne({
        participants: { $all: [req.user._id, userId] }
    });

    if (!chat) {
        chat = await Chat.create({
            participants: [req.user._id, userId]
        });
    }

    // Populate for immediate return
    chat = await Chat.findById(chat._id).populate('participants', 'name profile_image');

    res.status(200).json({ success: true, data: chat });
}));

module.exports = router;
