let name = 'Conjunto Residencial "Bosques de Quitumbe IV"';

module.exports = (app) => {

    app.get('/', (req, res) => {
        res.render('login', {
            name,
            nombre: 'nIcOlAs cArRasCo - Maria Jose Jacome - Alisson Mendoza',
            pagina: 'Login',
        });
    });

    app.get('/updateA', (req, res) => {
        res.render('updateA', {
            name,
            pagina: 'Actualizar Adminstrador',
        });
    });

    app.get('/updateRA', (req, res) => {
        res.render('updateRA', {
            name,
            pagina: 'Actualizar Registro Adminstrador',
        });
    });

    app.get('/home', (req, res) => {
        res.render('home', {
            name,
            pagina: 'Inicio',
            username: `${req.session.person.nombre_administrador} ${req.session.person.apellido_administrador}`
        });
    });

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });

    app.get('/updateD', (req, res) => {
        res.render('updateD', {
            name,
            pagina: 'Actualizar Datos Vivienda',
        });
    });

    app.get('/updatePerson', (req, res) => {
        res.render('updatePerson', {
            name,
            pagina: 'Actualizar Personas',
        });
    });

    app.get('/registerPayments', (req, res) => {
        res.render('registerPayments', {
            name,
            pagina: 'Registro Alícuotas',
        });
    });

    app.get('/registerPerson', (req, res) => {
        res.render('registerPerson', {
            name,
            pagina: 'Registro Personas',
        });
    });
    //experimental
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

}