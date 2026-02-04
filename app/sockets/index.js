const { Server } = require('socket.io');
const chatHandler = require('./handlers/chat.handler');

let io;

const onlineUsers = new Map();

function initSocketServer(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTION']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('register', (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} registered with socket ID ${socket.id}`);
        });

        chatHandler(socket, onlineUsers, io);

        socket.on('disconnect', () => {
            for (let [userId, sockId] of onlineUsers.entries()) {
                if (sockId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
}

module.exports = { initSocketServer };
