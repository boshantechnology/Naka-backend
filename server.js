require('dotenv').config();
const http = require('http');
const app = require('./app');
const config = require('./app/config/config');
const connectDB = require('./app/config/db');
const { initSocketServer } = require('./app/sockets/index');

connectDB();

const PORT = config.PORT;

const server = http.createServer(app);

initSocketServer(server);

app.listen(PORT, () => console.log(`Server and socket.io running on port ${PORT}`));
