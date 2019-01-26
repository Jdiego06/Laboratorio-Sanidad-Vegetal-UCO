require('./Config/config');
const express = require('express');
const bodyParser = require('body-parser');
const Mongo = require('./DataBase/mongo');
const colors = require('colors');
const app = express();
const fileUpload = require('express-fileupload');


// Para permitir solicitudes desde cualquier dirección
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Para manejar x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

 


// Para subir archivo con express
app.use(fileUpload());


// Configuracion global de rutas
app.use(require('./Routes/index'));


// Conexión a la base de datos
Mongo.ConectMongo();


// Servidor web
app.listen(process.env.PORT, () => {
    console.log(" \n ");
    console.log(colors.green(`Express escuchando en el puerto: ${process.env.PORT}`));
});