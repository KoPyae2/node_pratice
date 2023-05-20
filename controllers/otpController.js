const db = require('../database/models/index');
const redisClient = require('../config/redis');

const betweenRandomNumber = (min, max) => {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

const handleOtpVerify = async (req, res) => {
    try {
        const reqOTP = req.body.otp;
        const email = req.email
        const correctOTP = await redisClient.get(`otp_${email}`);

        if (reqOTP != correctOTP) {
            return res.status(200).json({ 'err_code': -1, "err_msg": "wrong otp" });
        }

        const foundUser = await db.user.findOne({ where: { email } });
        foundUser.otpVerify = true;
        foundUser.save();
        res.status(200).json({
            'err_code': 0,
            'err_msg': 'Success',
            'data': foundUser
        });
    } catch (error) {
        res.status(500).json({ 'err_code': -1, "err_msg": error.message });
    }
}

const handleReqOtp = async (req, res) => {
    try {
        const email = req.email

        //delete old otp and create new and send mail
        await redisClient.del(`otp_${email}`, (error, result) => {
            if (error) {
                console.error(error);
            } else {
                console.log(`Key deleted: ${result}`);
            }
        });
        let otp = betweenRandomNumber(100000, 999999);
        await redisClient.set(`otp_${email}`, otp);

        res.status(200).json({
            'err_code': 0,
            'err_msg': 'Success'
        });
        await sendMail({
            to: email,
            otp: otp,
            username: req.username
        });

    } catch (error) {
        res.status(500).json({ 'err_code': -1, "err_msg": error.message });
    }
}

module.exports = {
    handleOtpVerify,
    handleReqOtp
};