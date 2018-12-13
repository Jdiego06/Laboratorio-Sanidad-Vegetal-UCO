const express = require('express');
const app = express();


app.use(require('./registros'));
app.use(require('./uploads'));



module.exports=app;