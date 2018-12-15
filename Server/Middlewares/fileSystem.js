const fs = require('fs');
const path = require('path');


function BorrarArchivo(NombreArchivo, tipo) {
    let Path = path.resolve(__dirname, `../../Uploads/${tipo}/${NombreArchivo}`);

    if (fs.existsSync(Path)) {
        fs.unlinkSync(Path);
    } else {
        throw new Error(`El archivo: ${Path} especificado no existe`);
    }
};


module.exports = {
    BorrarArchivo
}