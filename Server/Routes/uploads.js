const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const Registro = require('../models/registros');
const app = express();

app.use(fileUpload());




app.put('/UploadAudioReg/:id', (req, res) => {

    let id = req.params.id;

   
    if (!req.files.audio || (Object.keys(req.files) == 0)||req.files.audio.length) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se envió ningun audio, se enviaron varios o está dañado'
            }
        });
    };

    // Busca el registro, y guarda el audio si este existe

    Registro.findById(id, (err) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'El id no existe en el sistema'
                }
            });
        } else {
            let archivo = req.files.audio;
            MoverAudio(id, res, archivo)
        };
    });
});


app.put('/UploadImgReg/:id', (req, res) => {

    let id = req.params.id;

    // Si no existen archivos

    if (!req.files.imagenes || (Object.keys(req.files) == 0)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se envió ninguna imagen, o ésta está dañada'
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
                        MoverImagen(id, res, registroDb, archivo, 0)
                    } else {
                        MoverImagen(id, res, registroDb, archivo, 1)
                    };
                };

            } else {
                let archivo = req.files.imagenes;
                MoverImagen(id, res, registroDb, archivo, 1)
            };
        };
    });
});




// Guarda UNA UNICA imagen en el servidor y la agrega al registro en la base de datos

function MoverImagen(id, res, registroDb, archivo, finish) {

    let extencionesValidas = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];

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

    console.log(nombreArchivo);

    archivo.mv(`../Uploads/Registros-Imagenes/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

    });


    imgNumber = registroDb.imagenes.length
    imagenes = registroDb.imagenes;
    imagenes[imgNumber] = nombreArchivo;

    Registro.findByIdAndUpdate(id, {
        imagenes
    }, {
        new: true
    }, (err, registroDb) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            })

        if (finish == 1) {
            return res.status(200).json({
                ok: true,
                registroDb
            });
        };
    });
};


// Guarda Aadio en el servidor y la agrega al registro en la base de datos

function MoverAudio(id, res, archivo) {

    let extencionesValidas = ['wav', 'mp3', 'WAV', 'MP3'];

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


    let nombreArchivo = `${id}-${Date.now()}.${extencion}`;

    archivo.mv(`../Uploads/Registros-Audios/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
    });


    Registro.findById(id, (err, registroDb) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        if (registroDb.nota_voz && (registroDb.nota_voz != "")) {
            BorrarArchivo(registroDb.nota_voz, 'Registros-Audios');
        }


    });

    Registro.findByIdAndUpdate(id, {
        nota_voz: nombreArchivo
    }, {
        new: true
    }, (err, registroDb) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.status(200).json({
            ok: true,
            registroDb
        });
    });
};



function BorrarArchivo(NombreArchivo, tipo) {
    let Path = path.resolve(__dirname, `../../Uploads/${tipo}/${NombreArchivo}`);

    if (fs.existsSync(Path)) {
        fs.unlinkSync(Path);
    };
};


module.exports = app;