const bd = require('../config/bd_config');

let getEstado = async(req, res) => {
    let estadoA = await bd.queryG(req.body.estado);
    return res.send(estadoA);
};

let getAdmin = async(req, res) => {
    let resp = await bd.queryG('administrador');
    return res.json({ "data": resp });
};

let getRAdmin = async(req, res) => {
    let resp = await bd.queryG('registro_administrador,administrador,estado_administrador where registro_administrador.id_administrador = administrador.id_administrador and registro_administrador.id_estado_administrador =  estado_administrador.id_estado_administrador');
    return res.json({ "data": resp });
};
let getAdminById = async(req, res) => {
    let resp = await bd.queryG(req.query.estado);
    return res.json({ "data": resp });
};

let getD = async(req, res) => {
    let resp = await bd.queryG('vivienda, tipo_vivienda where vivienda.id_tipo_vivienda = tipo_vivienda.id_tipo_vivienda');
    return res.json({ "data": resp });
};

let getP = async(req, res) => {
    let resp = await bd.queryG('cobros, persona where persona.id_persona = cobros.id_persona');
    return res.json({ "data": resp });
};


module.exports = { getEstado, getAdmin, getAdminById, getRAdmin, getD, getP };