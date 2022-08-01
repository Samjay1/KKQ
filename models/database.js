const { response } = require('express');
const mysql = require('mysql');


function connection(){
    const db = mysql.createPool({
        connectionLimit : 100, 
        host: process.env.HOST,
        user: process.env.DB_USER,
        // port: process.env.PORT,
        // password: 'TfGEdHy6',
        database: process.env.DATABASE,
        charset: 'utf8mb4'
    });
    console.log("Database connected")

    return db;
}

module.exports = connection();
    
    