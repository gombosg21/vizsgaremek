const fs = require('fs/promises');
const fake = require('@faker-js/faker');
const Path = require('path');
const filetype = require('magic-bytes.js');
const Modes = require('fs').constants;

async function getImgFolder(desiredCount, destinationPath, imgParams) {
    if (desiredCount == undefined) { throw new Error("missing argument desiredCount"); };
    if (typeof desiredCount != "number") { throw new Error("desiredCount must be an integer"); };

    if (!destinationPath) { throw new Error("missing argument destinationPath") };
    if (typeof destinationPath != "string") { throw new TypeError("desiredCount must be a string"); };
    try {
        await fs.access(destinationPath, Modes.R_OK | Modes.W_OK);
    } catch (error) {
        try {
            await fs.mkdir(destinationPath, { recursive: true });
        } catch (error) {
            throw new Error("destinationPath ehiter doesnt exsits or we have insufficent r/w privilgedes");
        };
    };

    try {
        const files = await fs.readdir(destinationPath);
        if (files.length < desiredCount) {
            return await getIMG(desiredCount, destinationPath, imgParams);
        } else {
            const fileList = await listImgFolder(destinationPath);
            return await testForImg(fileList, desiredCount, destinationPath, imgParams);
        };
    } catch (error) {
        return await getIMG(desiredCount, destinationPath, imgParams);
    };
};

async function getIMG(desiredCount, destinationPath, imgParams) {
    if (!desiredCount) { throw new Error("missing argument desiredCount"); };
    if (typeof desiredCount != "number") { throw new TypeError("desiredCount must be an integer"); };

    if (!destinationPath) { throw new Error("missing argument destinationPath") };
    if (typeof destinationPath != "string") { throw new TypeError("desiredCount must be a string"); };
    try {
        await fs.access(destinationPath, Modes.R_OK | Modes.W_OK);
    } catch (error) {
        throw new Error("destinationPath ehiter doesnt exsits or we have insufficent r/w privilgedes");
    };

    const imgOptions = {
        width: undefined,
        height: undefined,
        randomize: false,
    };

    if (imgParams) {
        if (imgParams.width) {
            const width = imgParams.width;
            if (typeof width == "number" && width > 0 && width % 1 == 0) {
                imgOptions.width = width;
            };
        };
        if (imgParams.height) {
            const height = imgParams.height;
            if (typeof height == "number" && height > 0 && height % 1 == 0) {
                imgOptions.height = height;
            };
        };
        if (imgParams.randomize) {
            const randomize = imgParams.randomize;
            if (typeof randomize == "boolean") {
                imgOptions.randomize = randomize;
            };
        };
    };

    const options = {
        method: "GET"
    };

    const imgBlobArray = [];
    for (let i = 0; i < desiredCount; i++) {
        var imgURL = fake.faker.image.image(imgOptions.width, imgOptions.height, imgOptions.randomize);
        var response = await fetch(imgURL, options);

        if (response.status == 200) {
            var imgBlob = await response.blob();
            var imgBuffer = Buffer.from(await imgBlob.arrayBuffer());
            imgBlobArray.push(imgBlob);
            await fs.writeFile(destinationPath + "/" + `img_${i}.jpeg`, imgBuffer);
        } else {
            throw new Error(`remote target returned with code ${response.status}`);
        };
    };
    return imgBlobArray;
};

async function listImgFolder(destinationPath) {
    if (!destinationPath) { throw new Error("missing argument destinationPath") };
    if (typeof destinationPath != "string") { throw new TypeError("desiredCount must be a string"); };
    try {
        await fs.access(destinationPath, Modes.R_OK | Modes.W_OK);
    } catch (error) {
        throw new Error("destinationPath ehiter doesnt exsits or we have insufficent r/w privilgedes");
    };

    return await fs.readdir(destinationPath);
};


async function testForImg(fileArray, desiredCount, destinationPath, imgParams) {
    if (fileArray == undefined) { throw new Error("missing argument fileArray"); };
    if (!fileArray instanceof Array) { throw new Error("fileArray must be an array"); };

    if (desiredCount == undefined) { throw new Error("missing argument desiredCount"); };
    if (typeof desiredCount != "number") { throw new Error("desiredCount must be an integer"); };

    if (!destinationPath) { throw new Error("missing argument destinationPath") };
    if (typeof destinationPath != "string") { throw new TypeError("desiredCount must be a string"); };
    try {
        await fs.access(destinationPath, Modes.R_OK | Modes.W_OK);
    } catch (error) {
        throw new Error("destinationPath ehiter doesnt exsits or we have insufficent r/w privilgedes");
    };

    const imgBlobArray = [];
    for (file of fileArray) {
        var filePath = (Path.join(destinationPath, file));
        var fileBuffer = await fs.readFile(filePath);

        if (!fileBuffer) { throw new Error('read failure'); };

        var type = filetype.filetypemime(fileBuffer);
        var fileData = new Blob([fileBuffer]);
        if (type[0].match(/image/gi)) { imgBlobArray.push(fileData); };
    };

    if (imgBlobArray.length >= desiredCount) {
        return imgBlobArray;
    } else {
        const files = await getIMG(desiredCount, destinationPath, imgParams);
        return files;
    };
};

module.exports.getImgFolder = getImgFolder;