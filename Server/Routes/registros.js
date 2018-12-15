const express = require('express');
var mongoose = require('mongoose');
const Registro = require('../models/registros');
const Fecha = require('../Middlewares/fechas');
const app = express();
const fileSystem = require('../Middlewares/fileSystem');





app.post('/registros', (req, res) => {

    let body = req.body;

    let registro = new Registro({
        descripcion: body.descripcion,
        causa: body.causa,
        cultivo: body.cultivo,
        metodo_cultivo: body.metodo_cultivo,
        metodo_produccion: body.metodo_produccion,
        tipo_fruto: body.tipo_fruto,
        lugar_procedencia: body.lugar_procedencia,
        tratamiento_sugerido: body.tratamiento_sugerido,
        analista: body.analista
    });


    registro.save((err, registroDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };


        Registro.findByIdAndUpdate(registroDb._id, {
            fecha_creacion: Fecha.ObtenerFecha(registroDb._id)
        }, {
            new: true
        }, (err, registroDb) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.status(201).json({
                ok: true,
                producto: registroDb
            });
        });
    });
});


app.put('/registros/:id', (req, res) => {


    let id = req.params.id;
    let bodyOne = req.body;

    // Selecciona solo los parametros enviados, no modifica los existenes, no cambia la fecha
    let body = {}
    for (key in bodyOne) {
        if (bodyOne[key] != null || bodyOne[key] != undefined) {
            body[key] = bodyOne[key]
        };
    };


    Registro.findByIdAndUpdate(id, body, {
        new: true
    }, (err, registroDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        res.status(201).json({
            ok: true,
            producto: registroDb
        });
    });
});



app.get('/registros/buscar', (req, res) => {


    termino = req.query.termino;
    parametro = req.query.parametro;



    let regex = new RegExp(termino, 'i');

    Registro.find({
        [parametro]: regex
    }).exec((err, registroDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            Registros_Encontrados: registroDb.length,
            registroDb
        });
    });
});



app.get('/registros/:id', (req, res) => {

    let id = req.params.id;

    Registro.findById(id).exec((err, RegistroDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!RegistroDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: RegistroDb
        });
    });
});


app.delete('/registros/:id', (req, res) => {

    id = req.params.id

    Registro.findById(id).exec((err, RegistroDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!RegistroDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }



        let Audio = RegistroDb.nota_voz;
        let Imagenes = RegistroDb.imagenes;

        let errores = [];

        if (Audio != undefined) {
            try {
                fileSystem.BorrarArchivo(Audio, 'Registros-Audios');
            } catch (err) {
                errores[errores.length] = `${Audio}`
            };
        };


        if (Imagenes != [] || Imagenes != undefined) {
            for (let i = 0; i < Imagenes.length; i++) {
                img = Imagenes[i];
                try {
                    fileSystem.BorrarArchivo(img, 'Registros-Imagenes');
                } catch (err) {
                    errores[errores.length] = `${img}`
                };
            };
        };

        Registro.findByIdAndRemove(id, (err) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } else {

                if (errores.length > 0) {
                    errN = `Los Siguientes archivos no se encontraron, o no fueron borrados: ${errores}.`
                } else {
                    errN = 'Todos los archivos asociados a el fueron borrados'
                }

                res.json({
                    ok: true,
                    msg: `El registro fue eliminado.  ${errN}`,
                });
            };
        });
    });
});


module.exports = app;