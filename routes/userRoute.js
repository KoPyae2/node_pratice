const Router = require('express');
const router = new Router;
const verifyJWT = require('./../middleware/verifyJWT')

const userController = require('./../controllers/userController')

router.put("/update", verifyJWT, userController.updateUser);

module.exports = router;