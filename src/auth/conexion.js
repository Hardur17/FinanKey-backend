const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
console.log("¿Existe .env?", fs.existsSync(".env"));
console.log("DB_NAME =", process.env.DB_NAME);


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conexión a la base de datos establecida');
});

module.exports = connection;