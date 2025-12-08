const express = require('express');
const helmet = require('helmet');
const xss = require('xss');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./app/config/cors');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

// Safe XSS sanitizer middleware
app.use((req, res, next) => {
    function sanitize(obj) {
        if (typeof obj !== 'object' || obj === null) return;
        for (let key of Object.keys(obj)) {
            if (typeof obj[key] === 'object') {
                sanitize(obj[key]);
            } else if (typeof obj[key] === 'string') {
                obj[key] = xss(obj[key]);
            }
        }
    }

    sanitize(req.body);
    sanitize(req.params);
    sanitize(req.query);

    next();
});
app.use(hpp());
app.use(cors(corsOptions));

app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
}));

app.use('/api/v1', require('./app/routes/index'));

app.use(require('./app/middlewares/error.middleware'));

module.exports = app;
