const hsb = require('hbs');
const bd = require('../config/bd_config');
hsb.registerHelper('getAnio', () => {
    return new Date().getFullYear();
});

hsb.registerHelper('getMeses', () => {
    let mes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    let resp = '';
    for (let index = 0; index < mes.length; index++) {
        if (new Date().getMonth() == index) {
            resp += `<option value="${mes[index]}" selected>${mes[index]}</option>`;
        }

        resp += `<option value="${mes[index]}">${mes[index]}</option>`;
    };
    return resp;
});

hsb.registerHelper('getAnios', () => {
    let aactual = new Date().getFullYear();
    let anios = [aactual];
    for (let index = 1; index < 6; index++) {
        anios.push(aactual - index);
        anios.push(aactual + index);
    }
    anios.sort((a, b) => { return b - a; });
    let resp = '';
    anios.forEach(element => {
        if (aactual == element) {
            resp += `<option data-tokens="${element}" selected>${element}</option> `;
        }
        resp += `<option data-tokens="${element}">${element}</option> `;
    });

    return resp;
});

hsb.registerHelper('capitalizar', (text) => {
    let palabras = text.split(' ');
    palabras.forEach((palabra, idx) => {
        palabras[idx] = palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    });
    return palabras.join(' ');
});

hsb.registerHelper('ifm', (text) => {
    let resp = '';
    if (text === 'Registrado Exitosamente') {
        resp = `<div id="login-alert" class="alert alert-success col-sm-12"> ${text} </div>  `;
    } else if (text === 'Correo o Contraseña no validos' || text === 'Usuario ya registrado' || text === 'Ha ocurrido un error intente nuevamente' || text === 'Alicuota ya registrada') {
        resp = `<div id="login-alert" class="alert alert-danger col-sm-12">${text} </div>  `;
    }
    return resp;

});