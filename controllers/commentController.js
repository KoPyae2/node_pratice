const db = require("../database/models");

const createComment = async (req, res) => {
    try {
        const { text, blogId } = req.body;

        if (!blogId) {
            return res.status(204).json({
                'err_code':-1,
                'err_msg': 'need to pass blog ID'
            });
        }

        const comment = await db.comment.create({
            text,
            userId: req.id,
            blogId,
        });

        await db.blog.increment(
            {commentCount : 1},
            {where:{
                id:blogId
            }}
        )

        res.status(200).json({
            'err_code':0,
            'err_msg': 'Success',
            'data': comment
        });


    } catch (error) {
        res.status(500).json({ 'err_code':-1,"err_msg": error.message });
    }
}

const updateComment = async (req, res) => {
    try {
        const commentId = req.body.id;

        if (!req.body.text || !commentId) {
            return res.status(204).json({
                'err_code':-1,
                'err_msg': 'need to pass comment and comment ID'
            });
        }

        const comment = await db.comment.findOne({
            where: {
                id: commentId,
            }
        });

        if (!comment || comment == null) {
            return res.status(200).json({
                'err_code':-1,
                'err_msg': 'Comment not found'
            });
        };

        if (comment.userId == req.id) {
            comment.text = req.body.text;
            await comment.save()
        } else {
            return res.status(500).json({
                'err_code':-1,
                "err_msg": "You can't edit this cpmment or is not your comment"
            });
        }

        res.status(200).json({
            'err_code':0,
            'err_msg': 'Success',
            'data': comment
        });

    } catch (error) {
        res.status(500).json({ 'err_code':-1,"err_msg": error.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const commentId = req.body.id;
        if (!commentId || !req.body.blogId) {
            return res.status(204).json({
                'err_code':-1,
                'err_msg': 'need to pass blog id and comment id'
            });
        }
        const comment = await db.comment.findOne({
            where: {
                id: commentId
            }
        });
        if (!comment || comment == null) {
            return res.status(200).json({ 'err_code':-1,'err_msg': 'Comment not found !' });
        }
        await db.comment.destroy({
            where:{
                id : commentId
            }
        });
        await db.blog.decrement(
            {commentCount : 1},
            {where:{
                id:req.body.blogId
            }}
        )
        res.status(200).json({ 'err_code':0,'err_msg': 'Success' }); 
    } catch (error) {
        res.status(500).json({ 'err_code':-1,"err_msg": error.message });
    }
}

const getComment = async (req,res) => {
    try {
        const { page, page_size } = req.body
        if (!req.body.blogId) {
            return res.status(204).json({
                'err_code':-1,
                'err_msg': 'need to pass blog id !'
            });
        }

        const { count, rows } = await db.comment.findAndCountAll({
            where:{
                blogId : req.body.blogId
            },
            offset: (page - 1) * page_size || 0,
            limit: page_size || 10,
            include: [
                { model: db.user, attributes: ['username', 'avatarURL'] }
            ]
        });
        res.status(200).json({
            'err_code':0,
            'err_msg': 'Success',
            'total': count,
            'data': rows
        });
    } catch(error) {

    }
}


module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getComment
}