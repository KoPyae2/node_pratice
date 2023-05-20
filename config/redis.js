const redis = require('redis');

let redisClient = null;

const connectRedit = async () => {
    redisClient = redis.createClient({
        host: 'localhost', // Redis server hostname
        port: 6379,
    });

    redisClient.on("error", (error) => {
        console.log("redis error", error);
    });
    redisClient.on("connect", () => {
        console.log("Redis connected!");
    });

    await redisClient.connect();
}
connectRedit();

module.exports = redisClient;