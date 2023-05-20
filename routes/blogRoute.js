const verifyJWT = require('./../middleware/verifyJWT');
const Router = require('express');
const router = new Router;

const blogController = require('./../controllers/BlogController');

router.get("/", verifyJWT, blogController.getOneOrAllBlogs);
router.post("/create", verifyJWT, blogController.createBlog);
router.put("/update", verifyJWT, blogController.updateBlog);
router.delete("/update", verifyJWT, blogController.deleteBlog);

module.exports = router;