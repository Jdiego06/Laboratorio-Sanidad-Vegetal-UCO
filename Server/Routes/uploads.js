const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const Registro = require('../models/registros');
const app = express();

app.use(fileUpload());



app.put('/UploadImgReg/:id', (req, res) => {

    let id = req.params.id;

    // Si no existen archivos

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se subió ningun archivo'
            }
        });
    };

    // Busca el registro, y guarda las imagenes si este existe

    Registro.findById(id, (err, registroDb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'El id no existe en el sistema'
                }
            });
        } else {

            let numImg = req.files.imagenes.length;

            if (numImg) {
                for (let i = 0; i < numImg; i++) {
                    let archivo = req.files.imagenes[i];
                    if (i != (numImg - 1)) {
                        movefile(id, req, res, registroDb, archivo, 0)
                    } else {
                        movefile(id, req, res, registroDb, archivo, 1)
                    };
                };

            } else {
                let archivo = req.files.imagenes;
                movefile(id, req, res, registroDb, archivo, 1)
            };
        };
    });
});




// Guarda UNA UNICA imagen en el servidor y la agrega al registro en la base de datos

function movefile(id, req, res, registroDb, archivo, finish) {

    let extencionesValidas = ['png', 'jpg', 'jpeg'];

    let nombreArchivoSep = archivo.name.split('.');
    let extencion = nombreArchivoSep[nombreArchivoSep.length - 1];


    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                err: `Extencion no válida, las extenciones válidas son: ${extencionesValidas.join(', ')}`,
                msg: `El archivo enviado fue: ${archivo.name}`
            }
        });
    };


    // Bloquea el programa por 'delay (ms)', antes de continuar
    // para garantizar nombres diferentes en las imágenes

    let delay = 1;
    let datei = Date.now();
    for (let i = 0; i < (datei * datei * datei); i++) {
        let date = Date.now()
        if (date >= (datei + delay)) {
            break;
        };
    };


    let nombreArchivo = `${id}-${Date.now()}.${extencion}`;


    archivo.mv(`./Uploads/Registros-Imagenes/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
    });


    imgNumber = registroDb.imagenes.length
    imagenes = registroDb.imagenes;
    imagenes[imgNumber] = nombreArchivo;

    Registro.findOneAndUpdate(id, {
        imagenes
    }, {
        new: true
    }, (err, registroDb) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (finish == 1) {
            res.status(200).json({
                ok: true,
                registroDb
            });
        }
    });
};


module.exports = app;