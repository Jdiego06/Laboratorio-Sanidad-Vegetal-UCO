const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/imagenes/:img', (req, res) => {

    let img = req.params.img;

    let Pathimg = path.resolve(__dirname, `../../Uploads/Registros-Imagenes/${img}`)
    let noImgPath = path.resolve(__dirname, '../assets/No-Image.png');


    if (fs.existsSync(Pathimg)) {
        res.sendFile(Pathimg);
    } else {
        res.sendFile(noImgPath);
    }
});



app.get('/audios/:audio', (req, res) => {

    let audio = req.params.audio;

    let pathAudio = path.resolve(__dirname, `../../Uploads/Registros-Audios/${audio}`)
    let noPathAudio = path.resolve(__dirname, '../assets/No-Audio.wav');


    if (fs.existsSync(pathAudio)) {
        res.sendFile(pathAudio);
    } else {
        res.sendFile(noPathAudio);
    }
});



module.exports = app;