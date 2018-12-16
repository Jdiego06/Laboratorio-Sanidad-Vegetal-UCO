const express = require('express');
const fs = require('fs');
const path = require('path');
const Registro = require('../models/registros');
const fileSystem = require('../Middlewares/fileSystem');
const app = express();



// Devuelve al cliente un archivo de la carpeta Uploads

app.get('/archivos/:tipo/:fileName', (req, res) => {

    let fileName = req.params.fileName;
    let tipo = req.params.tipo;


    if (tipo == 'audio') {
        tipo = 'Registros-Audios'
    } else if (tipo == 'imagen') {
        tipo = 'Registros-Imagenes'
    } else {
        res.status(400).json({
            ok: false,
            msg: 'El tipo de archivo no es válido'
        });
    };


    let PathFile = path.resolve(__dirname, `../../Uploads/${tipo}/${fileName}`)

    if (fs.existsSync(PathFile)) {
        res.sendFile(PathFile);
    } else {
        res.status(404).json({
            ok: false,
            msg: 'El archivo no existe en el sistema'
        });
    }
});


// Sube archivos a la carpeta Uploads, y los asocia a un registro

app.put('/archivos/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;

    switch (tipo) {
        case 'imagenes':
            Imagen(req, res);
            break;
        case 'audio':
            Audio(req, res);
            break;
        default:
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El tipo de archivo que quiere guardar no es válido'
                }
            });
    };
});




function Audio(req, res) {

    let id = req.params.id;

    // Verifica que el archvo exista y que no este dañado
    if (!req.files.audio || (Object.keys(req.files) == 0) || req.files.audio.length) {
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
}




function Imagen(req, res) {

    let id = req.params.id;

    // Verifica que el archvo exista y que no este dañado

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

            // Verifica si se subieron varias imagenes

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
};




// Guarda UNA UNICA imagen en el servidor y la agrega al registro en la base de datos

function MoverImagen(id, res, registroDb, archivo, finish) {

    let extencionesValidas = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];

    let nombreArchivoSep = archivo.name.split('.');
    let extencion = nombreArchivoSep[nombreArchivoSep.length - 1];

    // Verifica que la extencion del archivo sea válida

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

    while (Date.now() <= (datei + delay)) {

    };


    // Asigna un nuevo nombre al archivo y lo mueve al fichero correspondiente dentro de la carpeta Uploads

    let nombreArchivo = `${id}-${Date.now()}.${extencion}`;

    archivo.mv(`./Uploads/Registros-Imagenes/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

    });

    // Guarda el nombre del nuevo archivo en la base de datos, asociado al Id correspondiente

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

        // Verifica si es el ultimo archivo, y envia una respuesta al cliente 
        if (finish == 1) {
            return res.status(200).json({
                ok: true,
                registroDb
            });
        };
    });
};


// Guarda Audio en el servidor y la agrega al registro en la base de datos

function MoverAudio(id, res, archivo) {

    let extencionesValidas = ['wav', 'mp3', 'WAV', 'MP3'];

    let nombreArchivoSep = archivo.name.split('.');
    let extencion = nombreArchivoSep[nombreArchivoSep.length - 1];

    // Verifica que la extencion sea válida
    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                err: `Extencion no válida, las extenciones válidas son: ${extencionesValidas.join(', ')}`,
                msg: `El archivo enviado fue: ${archivo.name}`
            }
        });
    };


    // Asigna un nuevo nombre al archivo, y lo mueve al fichero correspondiente dentro de la carpeta Uploads 

    let nombreArchivo = `${id}-${Date.now()}.${extencion}`;

    archivo.mv(`./Uploads/Registros-Audios/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
    });


    // Borra el audio antiguo de la base de datos

    Registro.findById(id, (err, registroDb) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (registroDb.nota_voz && (registroDb.nota_voz != "")) {
            fileSystem.BorrarArchivo(registroDb.nota_voz, 'Registros-Audios');
        };
    });


    // Registra en la base de datos el nombre del nuevo archivo, correspondiente con el Id enviado 

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


module.exports = app;