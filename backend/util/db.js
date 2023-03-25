const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const mode = "development"

const { database, username, password, host, port, charset, collate, dialect } = config[mode]

const connection = mysql.createConnection({
    host: host,
    user: username,
    password: password,
    port: port
});

exports.connect = async () => {
    try {
        (await connection).connect();
        console.log(`connection to ${host}:${port} was successfully established`);
    } catch (error) {
        console.error(error);
    };
};

exports.disconnect = async () => {
    try {
        (await connection).end((err) => { console.error(err) });
        console.log(`connection to  ${host}:${port} was successfully closed`);
    } catch (error) {
        console.error(error);
    };
};

exports.initDB = async () => {
    try {
        (await connection).query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET \`${charset}\` COLLATE \`${collate}\` ;`);
        console.log(`Database: ${database} Initialised.`);
    } catch (error) {
        console.error(error);
    };
};

exports.destroyDB = async () => {
    try {
        (await connection).query(`DROP DATABASE IF EXISTS \`${database}\` ;`);
        console.log(`Database: ${database} destroyed.`);
    } catch (error) {
        console.error(error);
    };
};

exports.connection = connection;

    // const sequelize = new Sequelize(database,username,password,{dialect: dialect})

