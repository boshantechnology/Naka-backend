const Chat = require('../../models/chat.model');
const Message = require('../../models/message.model');

module.exports = function (socket, onlineUsers, io) {
    socket.on('join_room', async ({ chatId }) => {
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined room ${chatId}`);
    });

    socket.on('private_message', async ({ chatId, toUserId, fromUserId, message, type = 'text' }) => {
        try {
            // Save to DB
            let chat = await Chat.findById(chatId);

            // If no chat ID provided, try to find or create based on participants (simplified logic)
            if (!chatId) {
                chat = await Chat.findOne({
                    participants: { $all: [fromUserId, toUserId] }
                });
                if (!chat) {
                    chat = await Chat.create({ participants: [fromUserId, toUserId] });
                }
                chatId = chat._id;
            }

            const newMessage = await Message.create({
                chat_id: chatId,
                sender_id: fromUserId,
                content: message,
                type
            });

            await Chat.findByIdAndUpdate(chatId, { last_message: newMessage._id });

            // Emit to room (if using rooms) OR specifically to user
            const toSocketId = onlineUsers.get(toUserId);

            // 1. Send to specific user via socket ID if online
            if (toSocketId) {
                io.to(toSocketId).emit('receive_message', newMessage);
            }

            // 2. OR broadcast to room if both joined
            // io.to(chatId).emit('receive_message', newMessage);

            // Acknowledge back to sender
            socket.emit('message_sent', newMessage);

        } catch (error) {
            console.error("Message send error:", error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });
};
