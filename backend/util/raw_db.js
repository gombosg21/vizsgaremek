const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const mode = "development"

const { database, username, password, host, port, charset, collate, dialect } = config[mode]

const rawConnection = mysql.createConnection({
    host: host,
    user: username,
    password: password,
    port: port
});

exports.rawConnect = async () => {
    try {
        (await rawConnection).connect();
        console.log(`connection to ${host}:${port} was successfully established`);
    } catch (error) {
        console.error(error);
    };
};

exports.rawDisconnet = async () => {
    try {
        (await rawConnection).end((err) => { console.error(err) });
        console.log(`connection to  ${host}:${port} was successfully closed`);
    } catch (error) {
        console.error(error);
    };
};

exports.initDB = async () => {
    try {
        (await rawConnection).query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET \`${charset}\` COLLATE \`${collate}\` ;`);
        console.log(`Database: ${database} Initialised.`);
    } catch (error) {
        console.error(error);
    };
};

exports.destroyDB = async () => {
    try {
        (await rawConnection).query(`DROP DATABASE IF EXISTS \`${database}\` ;`);
        console.log(`Database: ${database} destroyed.`);
    } catch (error) {
        console.error(error);
    };
};

exports.rawConnection = rawConnection;