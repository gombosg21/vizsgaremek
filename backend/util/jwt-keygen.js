const auth = require('./auth');
const fs = require('fs/promises');
const path = require('path');
const process = require('process');

const run = async () => {
    try {
        try { await fs.access("../keys", fs.constants.R_OK) } catch (error) {
            await fs.mkdir("../keys")
        }
        auth.writeJWTKeys();
    } catch (error) {
        console.log(error);
    };
}

run();


process.on('exit', (code) => {
    console.log(`Program has exited with code: ${code}`)
});