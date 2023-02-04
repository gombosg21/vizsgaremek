 const { Sequelize } = require('sequelize');
 const mysql = require('mysql2/promise')
 const config = require('../config/config.json')

 const mode = "development"

exports.init = async () => {
    const {database,username,password,host,port,dialect} = config[mode]
    // console.log(`database:${database},username:${username},password:${password},host:${host},port:${port},dialect:${dialect}`)
    const connection = await mysql.createConnection({
        host: host,
        user : username,
        password: password,
        port: port
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_hungarian_ci' ;`)

    // const sequelize = new Sequelize(database,username,password,{dialect: dialect})
};
