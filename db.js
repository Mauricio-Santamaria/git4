const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Tu usuario de MySQL
    password: 'Kali1357',      // Tu contraseña de MySQL
    database: 'restaurante_db'
});

module.exports = pool;