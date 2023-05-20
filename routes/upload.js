const path = require("path");
const uuid = require("uuid");
require("dotenv").config();
const verifyJWT = require('./../middleware/verifyJWT')

const Router = require('express');
const router = new Router;

router.post('/upload',verifyJWT, (req, res) => {
    let sampleFile;
    let uploadPath;


    if (!req.files.file || Object.keys(req.files.file).length === 0) {
        return res.status(204).send({
            'err_code':-1,
            "err_msg": "need to pass file"
        });
    }

    sampleFile = req.files.file;
    console.log(sampleFile);
    

    const fileExt = sampleFile.name.split(".")[1];
    let fileName = uuid.v4() + `.${fileExt}`;

    uploadPath = path.resolve(__dirname, "..", "profile", fileName);

    const imgUrl = process.env.IMAGEDOMAIN +  fileName
    

    sampleFile.mv(uploadPath, err => {
        if (err) { return res.status(500).send(err); }
        res.send({
            'err_code':0,
            "err_msg": "Success",
            "img":imgUrl
        });
    });
});

module.exports = router;