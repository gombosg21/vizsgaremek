const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const mode = "development"

const { database, username, password, host, port, charset, collate, dialect } = config[mode]

const connection = mysql.createConnection({
    host: host,
    user: username,
    password: password,
    port: port,
    database: database
});

exports.connect = async () => {
    try {
        (await connection).connect();
        console.log(`connection to ${host}:${port} database: ${database} was successfully established`);
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

exports.connection = connection;