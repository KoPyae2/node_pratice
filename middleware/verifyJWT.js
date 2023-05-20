const jwt = require("jsonwebtoken");

require("dotenv").config();
const redisClient = require('./../config/redis');

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader == undefined || !authHeader) {
    return res.status(401).json({ "message": "Not allow to call api" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ "message": "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  const inDenyList = await redisClient.get(`token_${token}`);
  if (inDenyList) {
    return res.status(401).send({
      message: "Token is reject",
    });
  };

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token or expire!" });
    }

    if(!req.body.otp){
      if(decoded.verify == false){
        return res.status(403).json({ message: "Your account need to verify with otp" });
      }
    }

    req.email = decoded.UserInfo.email;
    req.id = decoded.UserInfo.id;
    req.token = token;
    req.tokenExp = decoded.exp;
    req.verify = decoded.verify
    req.username = decoded.username


    next();
  });
};

module.exports = verifyJWT;
