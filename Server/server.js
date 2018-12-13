require('./Config/config');
const express = require('express');
const bodyParser = require('body-parser');
const Mongo = require('./DataBase/mongo');
const colors = require('colors');
const app = express();



// Para manejar x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// Configuracion global de rutas
app.use(require('./Routes/index'));


// Conexión a la base de datos
Mongo.ConectMongo();


// Servidor web
app.listen(process.env.PORT, () => {
    console.log(" \n ");
    console.log(colors.green(`Express escuchando en el puerto: ${process.env.PORT}`));
});