const verifyJWT = require('./../middleware/verifyJWT');
const Router = require('express');
const router = new Router;

const commentController = require('./../controllers/commentController')

router.get('/',verifyJWT,commentController.getComment);
router.post('/create',verifyJWT,commentController.createComment);
router.put('/update',verifyJWT,commentController.updateComment);
router.delete('/delete',verifyJWT,commentController.deleteComment);


module.exports = router;