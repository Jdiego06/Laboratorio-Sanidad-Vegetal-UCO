const express = require('express');
const Registro = require('../models/registros');
const app = express();





app.post('/registro', (req, res) => {

    let body = req.body;

    let registro = new Registro({
        descripcion:body.descripcion,
        causa:body.causa,
        cultivo:body.cultivo,
        metodo_cultivo:body.metodo_cultivo,
        metodo_produccion:body.metodo_produccion,
        tipo_fruto:body.tipo_fruto,
        lugar_procedencia:body.lugar_procedencia,
        tratamiento_sugerido:body.tratamiento_sugerido,
        analista:body.analista        
    });


    registro.save((err, registroDb) => {

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



module.exports=app;