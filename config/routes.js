let name = 'Conjunto Residencial "Bosques de Quitumbe IV"';
const { verificaToken } = require('../middlewares/autenticacion');
module.exports = (app) => {

    app.get('/', (req, res) => {
        res.render('login', {
            name,
            nombre: 'nIcOlAs cArRasCo - Maria Jose Jacome - Alisson Mendoza',
            pagina: 'Login',
        });
    });

    app.get('/updateA', verificaToken, (req, res) => {
        res.render('updateA', {
            name,
            pagina: 'Actualizar Adminstrador',
        });
    });

    app.get('/updateRA', verificaToken, (req, res) => {
        res.render('updateRA', {
            name,
            pagina: 'Actualizar Registro Adminstrador',
        });
    });

    app.get('/home', verificaToken, (req, res) => {
        res.render('home', {
            name,
            pagina: 'Inicio',
            username: `${req.usuario.nombre_administrador} ${req.usuario.apellido_administrador}`
        });
    });

    app.get('/logout', verificaToken, (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });

    app.get('/updateD', verificaToken, (req, res) => {
        res.render('updateD', {
            name,
            pagina: 'Actualizar Datos Vivienda',
        });
    });

    app.get('/updatePerson', verificaToken, (req, res) => {
        res.render('updatePerson', {
            name,
            pagina: 'Actualizar Personas',
        });
    });

    app.get('/registerPayments', verificaToken, (req, res) => {
        res.render('registerPayments', {
            name,
            pagina: 'Registro Alícuotas',
        });
    });

    app.get('/registerPerson', verificaToken, (req, res) => {
        res.render('registerPerson', {
            name,
            pagina: 'Registro Personas',
        });
    });
    //experimental
    /*
    const fs = require('fs');
    app.post('/appinventor', (req, res) => {
        //console.log(req.body);
        res.json({
            "estado": "Autorizado",
            "nombre": "Pepito Juarez"

        });

        let buff = Buffer.from(req.body.Foto, 'base64');
        fs.writeFileSync('imagen.jpg', buff);

    });
    */

}