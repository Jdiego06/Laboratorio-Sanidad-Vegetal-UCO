// Obtiene la fecha usando un ObjectId

function ObtenerFecha(id) {

    let timestamp = id.getTimestamp();

    let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let anio = timestamp.getFullYear();
    let mes = 1 + timestamp.getMonth();
    let mesT = meses[mes - 1]
    let dia = timestamp.getDate();
    let hora = timestamp.getHours();
    let minutos = timestamp.getMinutes();
    let segundos = timestamp.getSeconds();


    if (hora == 12) {
        horam = hora
        m = 'PM';
    } else if (hora > 12) {
        horam = hora - 12
        m = 'PM';
    } else {
        m = 'AM'
        horam = hora
    };


    if (dia < 10) {
        dia = `0${dia}`
    }

    if (mesT < 10) {
        mesT = `0${mesT}`
    }

    if (horam < 10) {
        horam = `0${horam}`
    }

    if (minutos < 10) {
        minutos = `0${minutos}`
    }

    if (segundos < 10) {
        segundos = `0${segundos}`
    }


    return fecha = {
        fecha: `${dia} de ${mesT} del ${anio} ${horam}:${minutos}:${segundos} ${m}`,
        anio,
        mes,
        dia,
        hora,
        minutos,
        segundos
    };
};


// Obtiene la fecha actual del sistema

function ObtenerFechaActual() {

    let timestamp = new Date();

    let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let anio = timestamp.getFullYear();
    let mes = 1 + timestamp.getMonth();
    let mesT = meses[mes - 1]
    let dia = timestamp.getDate();
    let hora = timestamp.getHours();
    let minutos = timestamp.getMinutes();
    let segundos = timestamp.getSeconds();

    if (hora == 12) {
        horam = hora
        m = 'PM';
    } else if (hora > 12) {
        horam = hora - 12
        m = 'PM';
    } else {
        m = 'AM'
        horam = hora
    };


    if (dia < 10) {
        dia = `0${dia}`
    }

    if (mesT < 10) {
        mesT = `0${mesT}`
    }

    if (horam < 10) {
        horam = `0${horam}`
    }

    if (minutos < 10) {
        minutos = `0${minutos}`
    }

    if (segundos < 10) {
        segundos = `0${segundos}`
    }




    return fecha = {
        fecha: `${dia} de ${mesT} del ${anio} ${horam}:${minutos}:${segundos} ${m}`,
        anio,
        mes,
        dia,
        hora,
        minutos,
        segundos
    };
};


module.exports = {
    ObtenerFecha,
    ObtenerFechaActual
};