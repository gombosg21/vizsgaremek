const toBase64 = require("./serialize-file").getBase64;
const web_push = require("web-push");
const file = require("fs/promises");
const process = require("process")

exports.genKeys = async () => {
    try {
        if (file.access("../vapidKeys.json", file.constants.R_OK)) {
            throw new Error("vapid keys file already exsits!");
        };
        const keys = web_push.generateVAPIDKeys();
        await file.appendFile("../vapidKeys.json", JSON.stringify(keys)).then(() => {
            process.on('exit', (code) => {
                console.log(`Vapid keys generated successfully. \n Program has exited with code: ${code}`)
            });
        });
    } catch (error) {
        console.log(error);
    };
};

exports.bakeNotification = async (title, message, icon, image, action) => {

    if (!title) {
        throw new Error("argument title missing");
    };
    if (typeof title != "string") {
        throw new Error("title must be a string")
    };
    if (!message) {
        throw new Error("argument message missing");
    };
    if (typeof message != "string") {
        throw new Error("message must be a string")
    };

    const notification = {
        message: message,
        title: title
    };

    if (icon) {
        notification.icon = await toBase64(icon);
    };
    if (action) {
        notification.action = action;
    };
    if (image) {
        notification.image = await toBase64(image);
    };

    return notification;
};