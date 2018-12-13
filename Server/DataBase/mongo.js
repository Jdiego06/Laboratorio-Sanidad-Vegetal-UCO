const mongoose = require('mongoose');
const colors = require('colors');





ConectMongo = function () {
    mongoose.connect(process.env.UrlDB, {
        useNewUrlParser: true
    }, (err) => {
        if (err) {
            return err;
        } else {
            console.log(colors.green('Base de datos online'));
            console.log('\n');
        }
    });
}


module.exports = {
    ConectMongo
}