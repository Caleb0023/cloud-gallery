const { Router } = require('express');
const path = require('path');
const fse = require('fs-extra');
const router = Router();
const cloudinary = require('cloudinary').v2;

//cloudinary config
cloudinary.config({
    cloud_name: "" ,
    api_key: "",
    api_secret: ""
});
//model
const Image = require('../models/Image');
//entorno de desarrollo
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
};

router.get('/', async (req, res) => {
    const images = await Image.find();
    res.render('index.ejs', { images });
});

router.get('/upload', (req, res) => {
    res.render('upload.ejs');
})

router.post('/upload', async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const image = new Image();
        image.title = req.body.title;
        image.description = req.body.description;
        image.imageURL = result.url;
        image.public_id = result.public_id;
        await image.save();
        await fse.remove(req.file.path);
        res.status(200).redirect('/')
    } catch (error) {
        res.status(404).json({
            "mensaje": error
        })
    }
})

router.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    res.render('profile.ejs', { image });
})

router.get('/image/:id/delete', async (req, res) => {
    const { id } = req.params;
    const imageDeleted = await Image.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(imageDeleted.public_id);

    res.redirect('/');
})

module.exports = router;
