const verifyJWT = require('./../middleware/verifyJWT');
const Router = require('express');
const router = new Router;

const registerController = require('./../controllers/registerController');
const loginController = require('./../controllers/loginController');
const logoutController = require('./../controllers/logoutController');
const otpController = require('../controllers/otpController');

router.post('/register', registerController.handleNewUser);
router.post('/login', loginController.handleLogin);
router.post('/verify', verifyJWT,otpController.handleOtpVerify);
router.post('/reqOtp', verifyJWT,otpController.handleReqOtp);
router.get('/logout',verifyJWT, logoutController.handleLogout);

module.exports = router;