const crypto = require('crypto');

exports.generatePassword = async (password) => {
    const salt = crypto.randomBytes(64).toString('hex');

    return new Promise((resolve, rejects) => {
        crypto.scrypt(password, salt, 128, (error, derivedKey) => {
            if (error) {
                rejects(error);
            };
            resolve({
                salt: salt,
                hash: derivedKey.toString('hex')
            });
        });
    });
};

exports.validatePassword = (password, salt, hash) => {

    return new Promise((resolve, rejects) => {
        crypto.scrypt(password, salt, 128, (error, derivedKey) => {
            if (error) {
                rejects(error);
            };
            resolve(hash == derivedKey.toString('hex'));
        });
    });
};