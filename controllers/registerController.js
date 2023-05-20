const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/models");
const redisClient = require('./../config/redis');
const sendMail = require('./../config/mail')

const betweenRandomNumber = (min, max) => {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

const SendOtp = async (email,username) => {
    let otpCache = await redisClient.get(`otp_${email}`);
    otp = betweenRandomNumber(100000, 999999)
    console.log(otpCache);
    if (!otpCache) {
        await redisClient.set(`otp_${email}`, otp);
        await sendMail({
            to: email,
            otp: otp,
            username : username
        });
        console.log('mail send finished !');
    } else {
        await redisClient.del(`otp_${email}`, (error, result) => {
            if (error) {
                console.error(error);
            } else {
                console.log(`Key deleted: ${result}`);
            }
        });
        await sendMail({
            to: email,
            otp: otpCache,
            username : username
        });
        console.log('mail send finished !');
    }
}

const handleNewUser = async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password) {
        return res
            .status(204)
            .json({ 'err_code':-1,"err_msg": "Need to fill email and password" });
    }

    //   Check user already have 
    const duplicate = await db.user.findOne({ where: { email } });
    if (duplicate) {
        return res
            .status(200)
            .json({ 'err_code':-1,"err_msg": "Email is already exist. Try to login" });
    }

    try {
        // hash pass
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            email,
            password: hashPass,
            username,
        });
        const foundUser = await db.user.findOne({ where: { email } });

        const accessToken = jwt.sign(
            {
              "UserInfo": {
                "username":foundUser.username,
                "email": foundUser.email,
                "id": foundUser.id,
                "verify": foundUser.otpVerify
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );

        console.log(newUser.toJSON());
        
        delete foundUser.dataValues.password;
        res.status(200).json({ 
            'err_code':0,
            'err_msg':'Success',
            'token':accessToken,
            'data':foundUser
         });

        SendOtp(foundUser.email,foundUser.username);
    } catch (error) {
        res.status(500).json({ 'err_code':-1,"err_msg": error.message });
    }
};

module.exports = { handleNewUser };
