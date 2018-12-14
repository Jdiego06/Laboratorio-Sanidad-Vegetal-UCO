const express = require('express');
const app = express();


app.use(require('./registros'));
app.use(require('./uploads'));
app.use(require('./archivos'));


module.exports=app;