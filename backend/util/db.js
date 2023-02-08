const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const mode = "development"

const { database, username, password, host, port, dialect } = config[mode]

const connection = mysql.createConnection({
    host: host,
    user: username,
    password: password,
    port: port
});

exports.connect = async () => {
    try {
        (await connection).connect();
        console.log(`connection to ${host}:${port} was successfully established`)
    }
    catch (error) {
        console.log(error);
    }
}

exports.initDB = async () => {
    try {
        (await connection).query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_hungarian_ci' ;`)
    }
    catch (error) {
        console.log(error);
    }
};

exports.connection = connection;

    // const sequelize = new Sequelize(database,username,password,{dialect: dialect})

