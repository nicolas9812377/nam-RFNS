const express = require('express');
const app = express();
const hsb = require('hbs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
//quitar en el proximo push
const flash = require('connect-flash');
const session = require('express-session');

require('./hbs/helper');
const puerto = process.env.PORT || 3001;
app.use(express.static(__dirname + '/public'));
hsb.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json({ limit: '50mb' }));

require('./config/routes.js')(app);

const { loginA, registerA, updateA, registerRA, updateD, registerP, updateP, registerC, registerPs } = require('./controller/bd-controller');
//Peticiones de Registro
app.post('/', loginA);
app.post('/admin', registerA);
app.post('/registerRA', registerRA);
app.post('/registerP', registerP);
app.post('/registerPs', registerPs);
app.post('/registerC', registerC);
app.post('/updateA', updateA);
app.post('/updateD', updateD);
app.post('/updateP', updateP);


//Peticiones llenar combobox
const { getEstado, getAdmin, getAdminById, getRAdmin, getD, getP } = require('./hbs/helperAsync');
app.post('/getEstado', getEstado);
app.get('/getAdmin', getAdmin);
app.get('/getRAdmin', getRAdmin);
app.get('/getP', getP);
app.get('/getAdminByID', getAdminById);
app.get('/getD', getD);

//generar pdf
app.post('/generarpdf', require('./reports/reportPdf').generarPDF)

app.listen(puerto, () => {
    console.log(`Escuchando en el puerto ${puerto}`);
});