class OTPStore {
    constructor() {
        this.store = new Map();
    }

    set(key, value, expirySeconds) {
        // Pehle existing delete karo (agar already exist karta ho)
        if (this.store.has(key)) {
            clearTimeout(this.store.get(key).timeout);
        }

        // New timeout set karo auto-delete ke liye
        const timeout = setTimeout(() => {
            this.store.delete(key);
        }, expirySeconds * 1000);

        this.store.set(key, { value, timeout });
    }

    get(key) {
        const data = this.store.get(key);
        return data ? data.value : null;
    }

    delete(key) {
        if (this.store.has(key)) {
            clearTimeout(this.store.get(key).timeout);
            this.store.delete(key);
        }
    }
}

module.exports = new OTPStore();


// const Redis = require('ioredis');

// const redis = new Redis({
//     host: '127.0.0.1',
//     port: 6379
// });

// redis.on('connect', () => {
//     console.log('✅ Redis connected successfully');
// });

// redis.on('error', (err) => {
//     console.error('❌ Redis connection error:', err);
// });

// module.exports = redis;
