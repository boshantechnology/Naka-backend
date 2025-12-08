module.exports = function (socket, onlineUsers, io) {
    socket.on('private_message', ({ toUserId, fromUserId, message }) => {
        const toSocketId = onlineUsers.get(toUserId);

        if (toSocketId) {
            io.to(toSocketId).emit('receive_message', {
                fromUserId,
                message,
                timestamp: new Date()
            });
        } else {
            console.log(`User ${toUserId} is offline or not registered`);
        }
    });
};
