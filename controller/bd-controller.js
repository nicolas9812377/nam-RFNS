const pool = require('../config/bd_config').pool;
const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const url = require('url');
const loginA = async(req, res) => {
    let { username, password } = req.body;
    const resp = await pool.query('select * from administrador where username_administrador = $1', [username]);
    if (resp.rowCount > 0 && bcrypt.compareSync(password, resp.rows[0].clave_administrador)) {
        let { cedula_administrador, nombre_administrador, apellido_administrador, username_administrador } = resp.rows[0];
        // Generar el token
        let token = jwt.sign({
            usuario: { cedula_administrador, nombre_administrador, apellido_administrador, username_administrador }
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        req.session.token = token
        return res.redirect('/home');

    }
    return res.render('login', {
        name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
        nombre: 'Nicolas carrasco',
        pagina: 'Login',
        message: 'Correo o Contraseña no validos'
    });

};

const registerA = async(req, res) => {
    let { cedula, firstname, lastname, username, password } = req.body;
    password = bcrypt.hashSync(password, 10);
    const { rowCount } = await pool.query('select * from administrador where username_administrador = $1  or cedula_administrador = $2', [username, cedula]);
    if (rowCount === 0) {
        const resp = await pool.query('insert into administrador(cedula_administrador,nombre_administrador,apellido_administrador,username_administrador,clave_administrador) values($1,$2,$3,$4,$5)', [cedula, firstname, lastname, username, password]);
        res.render('login', {
            name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
            nombre: 'Nicolas carrasco',
            pagina: 'Login',
            message: 'Registrado Exitosamente'
        });
    } else {
        res.render('login', {
            name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
            nombre: 'Nicolas carrasco',
            pagina: 'Login',
            message: 'Usuario ya registrado'
        });
    }
}

const registerP = async(req, res) => {
    let { cedula, firstname, lastname, edad, tipoper, numcasa, fechaen, arregloFotos } = req.body;
    arreglo = arregloFotos.split(',data:image/png;base64,');
    const { rowCount } = await pool.query('select * from persona where cedula_persona = $1 ', [cedula]);
    if (rowCount === 0) {
        const resp = await pool.query('insert into persona (id_tipo_persona, cedula_persona, nombres_persona, apellidos_persona, edad_persona, entrada) values($1,$2,$3,$4,$5,$6)', [tipoper, cedula, firstname, lastname, edad, fechaen]);
        const itv = await pool.query('select * from vivienda where num_vivienda = $1', [numcasa]);
        const ip = await pool.query('select max(id_persona) from persona');
        const resp1 = await pool.query('insert into habitante_vivienda (num_vivienda, id_tipo_vivienda, id_persona, id_tipo_persona, id_estado_acceso) values($1,$2,$3,$4,$5)', [numcasa, itv.rows[0].id_tipo_vivienda, ip.rows[0].max, tipoper, 1]);
        const r = await pool.query('insert into fotos values($1,$2,$3)', [ip.rows[0].max, tipoper, arreglo[0]]);
        for (let i = 1; i < arreglo.length; i++) {
            const resp = await pool.query('insert into fotos values($1,$2,$3)', [ip.rows[0].max, tipoper, `data:image/png;base64,${arreglo[i]}`]);
        };
        //axios.get(`http://4dfb55755cfc.ngrok.io/?id_persona=${ip.rows[0].max}`);
        axios.get(`https://nam-reconocimientofacial.azurewebsites.net/?id_persona=${ip.rows[0].max}`);

        return res.render('addPersonV', {
            name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
            pagina: 'Registro Personas',
            message: 'Registrado Exitosamente'
        });
    } else {
        return res.render('addPersonV', {
            name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
            pagina: 'Registro Personas',
            message: 'Usuario ya registrado'
        });
    }
}

const registerPs = async(req, res) => {
    let { cedula, firstname, lastname, edad, tipoper, numcasa, fechaen, arregloFotos } = req.body;
    arreglo = arregloFotos.split(',data:image/png;base64,')
        /*Solucion para devolucion en string y no vector */
    if (arreglo.length == 1) {
        const { rowCount } = await pool.query('select * from persona where cedula_persona = $1 ', [cedula]);
        if (rowCount === 0) {
            const resp = await pool.query('insert into persona (id_tipo_persona, cedula_persona, nombres_persona, apellidos_persona, edad_persona, entrada) values($1,$2,$3,$4,$5,$6)', [tipoper, cedula, firstname, lastname, edad, fechaen]);
            const itv = await pool.query('select * from vivienda where num_vivienda = $1', [numcasa]);
            const ip = await pool.query('select max(id_persona) from persona');
            const resp1 = await pool.query('insert into habitante_vivienda (num_vivienda, id_tipo_vivienda, id_persona, id_tipo_persona, id_estado_acceso) values($1,$2,$3,$4,$5)', [numcasa, itv.rows[0].id_tipo_vivienda, ip.rows[0].max, tipoper, 1]);
            const r = await pool.query('insert into fotos values($1,$2,$3)', [ip.rows[0].max, tipoper, arreglo[0]]);
            axios.get(`https://nam-reconocimientofacial.azurewebsites.net/?id_persona=${ip.rows[0].max}`);
        } else {
            return res.render('registerPerson', {
                name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
                pagina: 'Registro Personas',
                message: 'Usuario ya registrado'
            });
        }
    } else {
        /* -- */
        for (let i = 0; i < arreglo.length; i++) {
            const { rowCount } = await pool.query('select * from persona where cedula_persona = $1 ', [cedula[i]]);
            if (rowCount === 0) {
                const resp = await pool.query('insert into persona (id_tipo_persona, cedula_persona, nombres_persona, apellidos_persona, edad_persona, entrada) values($1,$2,$3,$4,$5,$6)', [tipoper, cedula[i], firstname[i], lastname[i], edad[i], fechaen]);
                const itv = await pool.query('select * from vivienda where num_vivienda = $1', [numcasa]);
                const ip = await pool.query('select max(id_persona) from persona');
                const resp1 = await pool.query('insert into habitante_vivienda (num_vivienda, id_tipo_vivienda, id_persona, id_tipo_persona, id_estado_acceso) values($1,$2,$3,$4,$5)', [numcasa, itv.rows[0].id_tipo_vivienda, ip.rows[0].max, tipoper, 1]);
                if (i == 0) {
                    const r = await pool.query('insert into fotos values($1,$2,$3)', [ip.rows[0].max, tipoper, arreglo[0]]);
                } else {
                    const r = await pool.query('insert into fotos values($1,$2,$3)', [ip.rows[0].max, tipoper, `data:image/png;base64,${arreglo[i]}`]);
                }
                await axios.get(`https://nam-reconocimientofacial.azurewebsites.net/?id_persona=${ip.rows[0].max}`);
            } else {
                return res.render('registerPerson', {
                    name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
                    pagina: 'Registro Personas',
                    message: 'Usuario ya registrado'
                });
            }
        }
    }
    if (tipoper == 1) {
        const est = await pool.query('update vivienda set estado_habitante_vivienda = $1 where num_vivienda = $2 ', ['Ocupada', numcasa]);
    } else if (tipoper == 2) {
        const est = await pool.query('update vivienda set estado_habitante_vivienda = $1 where num_vivienda = $2 ', ['Arrendada', numcasa]);
    }

    return res.render('registerPerson', {
        name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
        pagina: 'Registro Personas',
        message: 'Registrado Exitosamente'
    });
}

const registerC = async(req, res) => {
    let { numcasa, perenc, mes, anio, monto, estado } = req.body;
    const { rowCount } = await pool.query('select * from cobros where estado = $1 and mes_pago = $2 and anio_pago = $3 and num_vivienda = $4', ['Pagado', mes, anio, numcasa]);
    if (rowCount === 0) {
        const sidp = await pool.query('select id_tipo_persona from persona where id_persona = $1', [perenc]);
        const itv = await pool.query('select id_tipo_vivienda from vivienda where num_vivienda = $1', [numcasa]);
        const resp = await pool.query("INSERT INTO cobros(num_vivienda, id_tipo_vivienda, id_persona, id_tipo_persona, cant_pago, fecha_pago, mes_pago, anio_pago, estado) VALUES ($1,$2,$3,$4,$5,to_date($6, 'DD-MM-YYYY'),$7,$8,$9)", [numcasa, itv.rows[0].id_tipo_vivienda, perenc, sidp.rows[0].id_tipo_persona, monto, new Date().toLocaleDateString(), mes, anio, estado]);
        res.redirect('/registerPayments');
    } else {
        res.render('registerPayments', {
            name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
            pagina: 'Registro Alícuotas',
            message: 'Alicuota ya registrada'
        });
    }

}

const registerRA = async(req, res) => {
    let { id, estadoA, fechacom, fechater } = req.body;
    try {
        if (fechater == '') {
            const resp = await pool.query(`insert into registro_administrador (id_estado_administrador, id_administrador, fecha_comienzo) values($1,$2,$3)`, [estadoA, id, fechacom]);
            return res.redirect('/updateRA');
        }
        const resp = await pool.query('insert into registro_administrador values($1,$2,$3,$4)', [estadoA, id, fechacom, fechater]);
        return res.redirect('/updateRA');
    } catch (err) {
        console.log(err.message);
        return res.render('updateRA', {
            name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
            pagina: 'Actualizar Registro Adminstrador',
            message: 'Ha ocurrido un error intente nuevamente'
        });
    }

}

const updateA = async(req, res) => {
    let { id, nombre, apellido, username } = req.body;
    const { rowCount } = await pool.query('update administrador set nombre_administrador = $1, apellido_administrador = $2, username_administrador = $3 where id_administrador = $4 ', [nombre, apellido, username, id]);
    return res.redirect('/updateA');
}

const updateD = async(req, res) => {
    let { id, estado } = req.body;
    if (estado === 'Disponible') {
        const rep = await pool.query('update habitante_vivienda set id_estado_acceso = 2 where num_vivienda = $1', [id]);
    }
    const { rowCount } = await pool.query('update vivienda set estado_habitante_vivienda = $1 where num_vivienda = $2 ', [estado, id]);
    return res.redirect('/updateD');

}


const updateP = async(req, res) => {
    let { cedula, firstname, lastname, edad, tipoper, numcasa, fechaen, fechater, estado, arregloFotos } = req.body;
    arreglo = arregloFotos.split(',data:image/png;base64,');
    if (fechater === '') {
        const up = await pool.query('update persona SET id_tipo_persona=$1, nombres_persona=$2, apellidos_persona=$3, edad_persona=$4, entrada=$5 where cedula_persona = $6 ', [tipoper, firstname, lastname, edad, fechaen, cedula]);
    } else {
        const up = await pool.query('update persona SET id_tipo_persona=$1, nombres_persona=$2, apellidos_persona=$3, edad_persona=$4, entrada=$5, fecha_salida=$6 where cedula_persona = $7 ', [tipoper, firstname, lastname, edad, fechaen, fechater, cedula]);
    }
    const sv = await pool.query('select id_tipo_vivienda from vivienda where num_vivienda = $1', [numcasa])
    const sidp = await pool.query('select id_persona from persona where cedula_persona = $1', [cedula])
    const resp = await pool.query('UPDATE habitante_vivienda SET num_vivienda=$1, id_tipo_vivienda=$2, id_tipo_persona=$3, id_estado_acceso=$4 WHERE id_persona=$5', [numcasa, sv.rows[0].id_tipo_vivienda, tipoper, estado, sidp.rows[0].id_persona]);
    if (arreglo[0] === '') {
        return res.redirect('/updatePerson');
    }
    const nombre = `${firstname} ${lastname}`;
    //axios.post('http://localhost:5000/updatePhoto', { nombre, cedula, foto: arreglo[0] }).catch(console.log)
    axios.post('https://nam-reconocimientofacial.azurewebsites.net/updatePhoto', { nombre, cedula, foto: arreglo[0] }).catch(console.log)

    const r = await pool.query('update fotos set foto = $1 where id_persona = $2', [arreglo[0], sidp.rows[0].id_persona]);
    return res.render('updatePerson', {
        name: 'Conjunto Residencial "Bosques de Quitumbe IV"',
        pagina: 'Actualizar Personas',
        message: 'Actualizado Exitosamente'
    });


}


module.exports = { loginA, registerA, updateA, registerRA, updateD, registerP, updateP, registerC, registerPs };