const db = require('./../database/models/index');
const bcrypt = require("bcrypt");


const updateUser = async (req, res) => {
    try{
        const userId = req.id;
        const user = await db.user.findOne({
            where: {
                id: userId,
            }
        });

        if (!user || user == null) {
            return res.status(200).json({
                'err_code':-1,
                'err_msg': 'User not found'
            });
        };
        if(req.body.email){
            user.email = req.body.email;
        };
        if(req.body.username){
            user.username = req.body.username;
        };
        if(req.body.avatarURL){
            user.avatarURL = req.body.avatarURL;
        };
        if(req.body.password){
            user.password = await bcrypt.hash(req.body.password, 10);
        };

        await user.save();

        delete user.password;

        res.status(200).json({
            'err_code':0,
            'err_msg': 'Success',
            'data': user
        });
    } catch (error) {
        res.status(500).json({ 'err_code':-1,"err_msg": error.message });
    }
}

module.exports = {updateUser}