const db = require("../database/models");

const createBlog = async (req, res) => {
    try {
        const { title, body, imageURL } = req.body;

        const blog = await db.blog.create({
            title,
            body,
            imageURL,
            userId: req.id
        });

        res.status(200).json({
            'err_code':0,
            'err_msg': 'Success',
            'data': blog
        });
    } catch (error) {
        res.status(500).json({ "err_msg": error.message });
    }
}

const updateBlog = async (req, res) => {
    try {
        const blogId = req.body.id;

        if (!req.body.title || !req.body.body) {
            return res.status(204).json({
                'err_code':-1,
                'err_msg': 'need to pass blog title and blog body'
            });
        }

        const blog = await db.blog.findOne({
            where: {
                id: blogId,
            }
        });

        if (!blog || blog == null) {
            return res.status(200).json({
                'err_code':-1,
                'err_msg': 'Blog not found'
            });
        };
        if (blog.userId == req.id) {
            blog.title = req.body.title;
            blog.body = req.body.body;
            blog.imageURL = req.body.imageURL || null;
            await blog.save()
        } else {
            return res.status(500).json({
                "err_msg": "You can't edit this blog or is not your blog"
            });
        }
        res.status(200).json({
            'err_code':0,
            'err_msg': 'Success',
            'data': blog
        });
    } catch (error) {
        res.status(500).json({ 'err_code':-1,"err_msg": error.message });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const blogId = req.body.id;
        const blog = await db.blog.findOne({
            where: {
                id: blogId,
            }
        });

        if (!blog || blog == null) {
            return res.status(200).json({ 'err_code':-1,'err_msg': 'Blog not found' });
        };

        if (blog.userId == req.id) {
            await db.blog.destroy({
                where: { id: blogId },
            });
            res.status(200).json({ 'err_code':0,'err_msg': 'Success' })
        } else {
            return res.status(500).json({
                'err_code':-1,
                "err_msg": "You can't delete this blog or is not your blog"
            });
        }
    } catch (error) {
        res.status(500).json({ 'err_code':-1,"err_msg": error.message });
    }
}

const getOneOrAllBlogs = async (req, res) => {
    try {
        const blogId = req.body.id;
        const { page, page_size } = req.body

        if (blogId) {
            const blog = await db.blog.findOne({
                where: { id: blogId },
                include: [
                    { model: db.user, attributes: ['username', 'avatarURL'] },
                    {
                        model: db.comment, attributes: ['text', 'userId'],
                        include: [
                            { model: db.user, attributes: ['username', 'avatarURL'] }
                        ]
                    }
                ]
            });

            if (!blog || blog == null) {
                return res.status(200).json({
                    'err_code':-1,
                    'err_msg': 'Blog not found'
                });
            };

            res.status(200).json({
                'err_code':0,
                'err_msg': 'Success',
                'data': blog
            });

        } else {
            const { count, rows } = await db.blog.findAndCountAll({
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
        }
    } catch (error) {
        res.status(500).json({ 'err_code':-1,"err_msg": error.message });
    }
}

module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    getOneOrAllBlogs
}