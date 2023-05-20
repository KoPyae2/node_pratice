require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./../database/models/index");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(200).json({ "err_code":-1,"err_msg": "Need to fill email and passseord" });
  }

  const foundUser = await db.user.findOne({ where: { email } });
  if (!foundUser) {
    return res.status(200).json({ "err_code":-1,"message": "This email is not register yet!" });
  }

  //   check password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    //  JWT creation
    console.log('user verify or not ', foundUser.otpVerify);
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
      { expiresIn: "1d" }
    );

    delete foundUser.dataValues.password

    if (foundUser.otpVerify == false) {
      return res.status(200).json({
        'err_code': -1,
        'err_msg': 'Need OTP verify',
        'token': accessToken,
        'data': foundUser
      });
    }

    res.status(200).json({
      'err_code': 0,
      'err_msg': 'Success',
      'token': accessToken,
      'data': foundUser
    });
  } else {
    res.status(200).json({ "err_code":-1,"err_msg": "Wrong password!" });
  }
};

module.exports = { handleLogin };
