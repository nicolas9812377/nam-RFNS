const jwt = require('jsonwebtoken');

// =============================
// Verificar Token
// =============================

let verificaToken = (req, res, next) => {
    let token = req.session.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.redirect('/');
        }
        req.usuario = decoded.usuario;
        next();
    });

};
module.exports = {
    verificaToken
}