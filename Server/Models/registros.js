const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let registroSchema = new Schema({

    fecha_creacion: {
        type: Object,
    },

    descripcion: {
        type: String,
        required: [true, 'La descripcion es necesaria']
    },

    causa: {
        type: String,
        required: [true, 'La causa es necesaria']
    },

    cultivo: {
        type: String,
        required: [true, 'El cultivo es necesario']
    },

    metodo_cultivo: {
        type: String
    },

    metodo_produccion: {
        type: String
    },

    tipo_fruto: {
        type: String
    },

    lugar_procedencia: {
        type: String
    },

    tratamiento_sugerido: {
        type: String
    },

    imagenes: {
        type: Array
    },

    nota_voz: {
        type: String
    },

    analista: {
        type: Number,
        required: [true, 'El id del analista es necesario'],
        default: 0
    }
});


module.exports = mongoose.model('Registro', registroSchema);
