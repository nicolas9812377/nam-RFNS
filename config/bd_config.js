const { Pool } = require('pg');
config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}


const pool = new Pool({
    host: 'ec2-54-161-208-31.compute-1.amazonaws.com',
    port: 5432,
    user: 'hrtidddsbywysa',
    password: 'fcf775d2a98b8101d678e90e31609d6e7a5a3bf0ea737fa72d4e6f7c0ab97e27',
    database: 'dbeu6t89ksufg',
    ssl: {
        rejectUnauthorized: false
    }
});

const queryG = async(table) => {
    let resp = await pool.query(`select * from ${table}`)
    return resp.rows;
}
module.exports = { pool, queryG }