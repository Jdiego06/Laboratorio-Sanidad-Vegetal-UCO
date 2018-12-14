const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();



app.get('/imagenes/:img',(req,res)=>{

    let img = req.params.img;

    let Pathimg = path.resolve(__dirname, `../../Uploads/Registros-Imagenes/${img}`)
    let noImgPath = path.resolve(__dirname, '../assets/No-image.png');


    if (fs.existsSync(Pathimg)) {
        res.sendFile(Pathimg);
    } else {
        res.sendFile(noImgPath);
    }
});




module.exports=app;
