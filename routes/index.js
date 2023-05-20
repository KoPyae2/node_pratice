const Router = require('express');

const router = new Router();

const authRoute = require("./authRoute");
const blogRoute =require('./blogRoute')
const userRoute = require("./userRoute");
const commentRoute = require("./commentRoute");
const upload = require("./upload");

router.use("/", upload);
router.use("/auth/", authRoute);
router.use("/blog", blogRoute);
router.use("/user", userRoute);
router.use("/comment", commentRoute);

router.get('/',(req,res)=>{
    res.send('hehe')
})

module.exports = router;