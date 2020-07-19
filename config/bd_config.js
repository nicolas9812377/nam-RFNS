const { Pool } = require('pg');
config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}


const pool = new Pool({
    host: 'ec2-54-243-67-199.compute-1.amazonaws.com',
    port: 5432,
    user: 'bnigxbesqdmumt',
    password: '982012ffe7e7b20b27361f25a196f1b7e4a34225d961e8267053447ab35ecc6f',
    database: 'df1k5ot3fn3idt',
    ssl: {
        rejectUnauthorized: false
    }
});

const queryG = async(table) => {
    let resp = await pool.query(`select * from ${table}`)
    return resp.rows;
};
// =============================================
// Vencimiento del Token
// =============================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =============================================
// SEED de Autenticación
// =============================================
process.env.SEED = process.env.SEED || 'seed-desarrollo';
module.exports = { pool, queryG }