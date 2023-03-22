const crypto = require('crypto');

exports.generatePassword = async (password) => {

    if (!password) { throw new Error("attribute password missing"); };
    if (typeof password != "string") { throw new TypeError("password must be a string"); };

    const salt = crypto.randomBytes(256).toString('hex');

    return new Promise((resolve, rejects) => {
        crypto.scrypt(password, salt, 256, (error, derivedKey) => {
            if (error) {
                rejects(error);
            };
            resolve(
                salt + ":" + derivedKey.toString('hex')
            );
        });
    });
};

exports.validatePassword = (password, encryptedPassword) => {
    const regexCharMap = /[A-Za-z0-9]+:[A-Za-z0-9]+/;

    if (!password) { throw new Error("attribute password missing"); };
    if (typeof password != "string") { throw new TypeError("password must be a string"); };

    if (!encryptedPassword) { throw new Error("attribute encryptedPassword missing"); };
    if (typeof encryptedPassword != "string") { throw new TypeError("encryptedPassword must be a string"); };
    if (encryptedPassword.length != 1025) { throw new RangeError("salt must be 1025 characters long") };
    if (encryptedPassword.match(regexCharMap)[0] != encryptedPassword) { throw new TypeError("encryptedPassword must be a hexadecimal string"); };


    return new Promise((resolve, rejects) => {
        const salt = encryptedPassword.split(":")[0];
        const hash = encryptedPassword.split(":")[1];
        crypto.scrypt(password, salt, 256, (error, derivedKey) => {
            if (error) {
                rejects(error);
            };
            resolve(hash == derivedKey.toString('hex'));
        });
    });
};

exports.generateToken = () => {

    return new Promise((rejects, resolve) => {
        crypto.randomBytes(4096, (err, buff) => {
            if (err) {
                rejects(err);
            };
            resolve(buff.toString('base64url'))
        });
    });
};