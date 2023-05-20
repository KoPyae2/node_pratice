const redisClient = require('./../config/redis');

const handleLogout = async (req, res) => {
    try {
        const token_key = `token_${req.token}`;
        await redisClient.set(token_key, req.token);
        redisClient.expireAt(token_key, req.tokenExp);
        res.status(200).json({ 'err_code': 0, 'err_msg': 'Success' });
    } catch (error) {
        res.status(500).json({ 'err_code': -1, "err_msg": error.message });
    }

};

module.exports = { handleLogout };
