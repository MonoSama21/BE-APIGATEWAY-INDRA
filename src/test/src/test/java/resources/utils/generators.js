(function () {
    function generarCodigoAleatorio() {
        var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var resultado = '';
        for (var i = 0; i < 6; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
    }

    function generarNombreCodigoAleatorio() {
        var palabras = ['CYBER', 'DIGITAL', 'PROMO', 'BONUS', 'SUPER', 'MEGA', 'ULTRA', 'POWER'];
        var sufijos = ['DEAL', 'OFFER', 'SALE', 'CODE', 'PLUS', 'MAX', 'PRO', 'ELITE'];
        var numeros = Math.floor(Math.random() * 999) + 1;

        var palabra = palabras[Math.floor(Math.random() * palabras.length)];
        var sufijo = sufijos[Math.floor(Math.random() * sufijos.length)];

        return palabra + sufijo + numeros;
    }

    function obtenerFechaHoy() {
        var fecha = new Date();
        var año = fecha.getFullYear();
        var mes = String(fecha.getMonth() + 1).padStart(2, '0');
        var dia = String(fecha.getDate()).padStart(2, '0');
        return año + '-' + mes + '-' + dia;
    }

    function obtenerFechaManana() {
        var fecha = new Date();
        fecha.setDate(fecha.getDate() + 1);
        var año = fecha.getFullYear();
        var mes = String(fecha.getMonth() + 1).padStart(2, '0');
        var dia = String(fecha.getDate()).padStart(2, '0');
        return año + '-' + mes + '-' + dia;
    }

    function obtenerFechaDesdeConFormato() {
        var fecha = new Date();
        fecha.setDate(fecha.getDate()); 
        var año = fecha.getFullYear();
        var mes = String(fecha.getMonth() + 1).padStart(2, '0');
        var dia = String(fecha.getDate()).padStart(2, '0');
        var horas = String(fecha.getHours()).padStart(2, '0');
        var minutos = String(fecha.getMinutes()).padStart(2, '0');
        var segundos = String(fecha.getSeconds()).padStart(2, '0');
        return año + '-' + mes + '-' + dia + 'T' + horas + ':' + minutos + ':' + segundos;
    }

    function obtenerFechaHastaConFormato() {
        var fecha = new Date();
        fecha.setDate(fecha.getDate()); // Hoy
        fecha.setMinutes(fecha.getMinutes() + 2); // Dos minutos después
        var año = fecha.getFullYear();
        var mes = String(fecha.getMonth() + 1).padStart(2, '0');
        var dia = String(fecha.getDate()).padStart(2, '0');
        var horas = String(fecha.getHours()).padStart(2, '0');
        var minutos = String(fecha.getMinutes()).padStart(2, '0');
        var segundos = String(fecha.getSeconds()).padStart(2, '0');
        return año + '-' + mes + '-' + dia + 'T' + horas + ':' + minutos + ':' + segundos;
    }
    
    function GenerandoDataAleatoria() {
        var Faker = Java.type('com.github.javafaker.Faker');
        var faker = new Faker();
        return {
            nombreRandom: faker.name().fullName(),
            emailRandom: faker.internet().emailAddress(),
            telefonoRandom: faker.phoneNumber().cellPhone(),
            ocupacionRandom: faker.job().title()
        };
    }

    return {
        generarCodigoAleatorio: generarCodigoAleatorio,
        generarNombreCodigoAleatorio: generarNombreCodigoAleatorio,
        obtenerFechaHoy: obtenerFechaHoy,
        obtenerFechaManana: obtenerFechaManana,
        obtenerFechaDesdeConFormato: obtenerFechaDesdeConFormato,
        obtenerFechaHastaConFormato: obtenerFechaHastaConFormato,
        GenerandoDataAleatoria: GenerandoDataAleatoria,

    };
})()