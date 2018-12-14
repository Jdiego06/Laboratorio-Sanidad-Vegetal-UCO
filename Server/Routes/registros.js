const express = require('express');
const Registro = require('../models/registros');
const Fecha = require('../Middlewares/fechas');
const app = express();





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


module.exports = app;