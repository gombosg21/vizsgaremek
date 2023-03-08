const fs = require('fs/promises');
const fake = require('@faker-js/faker');
const Path = require('path');
const filetype = require('magic-bytes.js');


const temp = './temp';

async function getIMG(desiredCount) {
    if (desiredCount == undefined) {
        throw new Error("missing argument desiredCount");
    };

    if (typeof desiredCount != "number") {
        throw new Error("desiredCount must be an integer");
    };

    const options = {
        method: "GET"
    };

    const imgBlobArray = [];

    for (let i = 0; i < desiredCount; i++) {
        var imgURL = fake.faker.image.image();
        var response = await fetch(imgURL, options);

        if (response.status == 200) {
            var imgBlob = await response.blob();
            var imgBuffer = Buffer.from(await imgBlob.arrayBuffer());
            imgBlobArray.push(imgBlob);
            await fs.writeFile(temp + "/" + `img_${i}.jpeg`, imgBuffer);
        } else {
            throw new Error(`remote target returned with code ${response.status}`);
        };
    };
    return imgBlobArray;
};

async function getTemp(desiredCount) {
    if (desiredCount == undefined) {
        throw new Error("missing argument desiredCount");
    };

    if (typeof desiredCount != "number") {
        throw new Error("desiredCount must be an integer");
    };

    try {
        const files = await fs.readdir(temp);
        if (files.length < desiredCount) {
            await getIMG(desiredCount)
        }
        else {
            const fileList = await listTemp();
            await testForImg(fileList, desiredCount);
        };
    } catch (error) {
        await fs.mkdir(temp, { recursive: false });
        await getIMG(desiredCount);
    };
};


async function listTemp() {
    return await fs.readdir(temp);
};


async function testForImg(fileArray, desiredCount) {
    if (fileArray == undefined) {
        throw new Error("missing argument fileArray");
    };
    if (!fileArray instanceof Array) {
        throw new Error("fileArray must be an array");
    };
    if (desiredCount == undefined) {
        throw new Error("missing argument desiredCount");
    };
    if (typeof desiredCount != "number") {
        throw new Error("desiredCount must be an integer");
    };


    const imgBlobArray = [];

    for (file of fileArray) {
        var filePath = (Path.join(temp, file));
        var fileBuffer = await fs.readFile(filePath);

        if (!fileBuffer) {
            throw new Error('read failure');
        };

        var type = filetype.filetypemime(fileBuffer);

        var fileData = new Blob([fileBuffer]);

        if (type[0].match(/image/gi)) {
            imgBlobArray.push(fileData);
        };
    };
    

    if (imgBlobArray.length >= desiredCount) {
        return imgBlobArray;
    }
    else {
        return await getIMG(desiredCount);
    };
};

module.exports = getTemp();