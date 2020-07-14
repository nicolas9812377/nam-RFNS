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
    user: 'mrkegxewhirzat',
    password: 'c5af009f01440e63f1353b5c10b87b4dc8b60fe05fe5376ca498c92a085cc296',
    database: 'dsrnhaee12a4a',
    ssl: {
        rejectUnauthorized: false
    }
});

const queryG = async(table) => {
    let resp = await pool.query(`select * from ${table}`)
    return resp.rows;
}
module.exports = { pool, queryG }