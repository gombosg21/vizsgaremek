const crypto = require('crypto');

exports.generatePassword = async (password) => {

    if (!password) { throw new Error("attibute password missing"); };
    if (typeof password != "string") { throw new Error("password must be a string"); };

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
    const regexCharMap = /[0-9a-fA-F]+/;

    if (!password) { throw new Error("attibute password missing"); };
    if (typeof password != "string") { throw new Error("password must be a string"); };

    if (!salt) { throw new Error("attibute salt missing"); };
    if (typeof salt != "string") { throw new Error("salt must be a string"); };
    if (salt.length != 128) { throw new Error("salt must be 128 characters long") };
    if (salt.match(regexCharMap)[0] != salt) { throw new Error("salt must be a hexadecimal string"); };

    if (!hash) { throw new Error("attibute hash missing"); };
    if (typeof hash != "string") { throw new Error("hash must be a string"); };
    if (hash.length != 256) { throw new Error("hash must be 256 characters long") };
    if (hash.match(regexCharMap)[0] != hash) { throw new Error("hash must be a hexadecimal string"); };

    return new Promise((resolve, rejects) => {
        crypto.scrypt(password, salt, 128, (error, derivedKey) => {
            if (error) {
                rejects(error);
            };
            resolve(hash == derivedKey.toString('hex'));
        });
    });
};