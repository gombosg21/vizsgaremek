const mail = require('nodemailer');
const user = require('../models').user;

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
    }
});

const supportString = "<a> href='+" + process.env.DOMAIN + "/api/v/" + process.env.VERSION + "/support/email'</a>";


const makeVerfiyRegisterText = async (userName, verifyToken, registerDate) => {
    if (userName == null || undefined) {
        throw new Error("argument userName missing");
    };

    if (!(userName instanceof String)) {
        throw new Error("argument userName must be a string");
    };

    if (userName.length == 0) {
        throw new Error("argument userName cannot be an empty string");
    };

    if (verifyToken == null || undefined) {
        throw new Error("argument verifyToken missing");
    };

    if (!(verifyToken instanceof String)) {
        throw new Error("argument verifyToken must be a string");
    };

    if (!(await user.findOne({ where: { email_token: verifyToken } }))) {
        throw new Error("nonexsistent verifyToken");
    };

    if (registerDate == null || undefined) {
        throw new Error("argument registerDate missing");
    };

    if (!((new Date(registerDate)) instanceof Date)) {
        throw new Error("argument registerDate must be a valid Date");
    };

    const verifyUrl = process.env.DOMAIN + '/api/v/' + process.env.VERSION + '/user/verify-email/' + verifyToken;
    const expiryDate = new Date(registerDate);
    // TODO: add 30 days to expiryDate

    const htmlString = "";
    htmlString += "<h1>Regszitráció megerősítése<h1/>";
    htmlString += "<p>A VisualStory " + userName + " fiókod véglegesítéséhez kérlek kattints az alábbi linkre:<p/>";
    htmlString += "<a href='" + verifyUrl + "'>Regisztráció megerősítése</a>";
    htmlString += "<p>Amennyiben a regisztrációdat nem erősíted meg, a fiókod " + expiryDate + " törölve lesz<p/>";
    htmlString += "<p>Ha ezt a fiókot nem te hoztad létre, ezt az emailt vedd figyelmen kívül.</p>";
    htmlString += "<p>Ha úgy gondolod hogy valaki illegálisan a nevedben járt el, az alábbi linken keresztül felveheted a kapcsolatot velünk:</p>";
    htmlString += supportString;

    return htmlString;
};

const makeResetPasswordText = async (userName, resetToken) => {
    if (userName == null || undefined) {
        throw new Error("argument userName missing");
    };

    if (!(userName instanceof String)) {
        throw new Error("argument userName must be a string");
    };

    if (userName.length == 0) {
        throw new Error("argument userName cannot be an empty string");
    };

    if (resetToken == null || undefined) {
        throw new Error("argument verifyToken missing");
    };

    if (!(resetToken instanceof String)) {
        throw new Error("argument verifyToken must be a string");
    };

    if (!(await user.findOne({ where: { password_token: resetToken } }))) {
        throw new Error("nonexsistent verifyToken");
    };
    const resetUrl = process.env.DOMAIN + '/api/v/' + process.env.VERSION + '/user/password/' + verifyToken;

    const htmlString = "";
    htmlString += "<h1>Jelszó visszaállítása<h1/>";
    htmlString += "<p>A VisualStory " + userName + " fiókod jelszavának visszaállítására kattints az alábbi linkre:</p>";
    htmlString += "<a href='" + resetUrl + "'>Jelszó visszaállítása</a>";
    htmlString += "<p>Amennyiben a jelszóvisszállítást nem te kérvényezted, a kapcsolatot csapatunkkal az alábbi linken veheted fel:</p>";
    htmlString += supportString;

    return htmlString;
};

const makeBannedAccountText = (userName, banReasons) => {
    if (userName == null || undefined) {
        throw new Error("argument userName missing");
    };

    if (!(userName instanceof String)) {
        throw new Error("argument userName must be a string");
    };

    if (userName.length == 0) {
        throw new Error("argument userName cannot be an empty string");
    };

    if (banReasons == null || undefined) {
        throw new Error("argument banReasons missing");
    };

    if (!(banReasons instanceof Array)) {
        throw new Error("argument banReasons must be an array");
    };

    banReasons.forEach(reason => {
        if (!(reason instanceof String)) {
            throw new Error("banReasons can only contain strings");
        };
        if (reason.length == 0) {
            throw new Error("banReasons cannot contain an empty string");
        };
    });

    const htmlString = "";
    htmlString += "<h1>Fiókletiltás</h1>";
    htmlString += "<p>A " + userName + " VisualStory fiókod az alábbi okok miatt le lett tiltva:</p>";
    htmlString += "<ul>";
    banReasons.forEach(reason => {
        htmlString += "<li>"+ reason +"<li/>";
    });
    htmlString += "<ul/>";
    htmlString += "<p>Ha valaki más illetéktelen hozzáférése miatt történ e letiltás, a kapcsolatot csapatunkkal az alábbi linken veheted fel:</p>";
    htmlString += supportString;
    return htmlString;
};

const makeSuspendedAccountText = (userName, suspendReasons, suspendExpirationDate) => {
    if (userName == null || undefined) {
        throw new Error("argument userName missing");
    };

    if (!(userName instanceof String)) {
        throw new Error("argument userName must be a string");
    };

    if (userName.length == 0) {
        throw new Error("argument userName cannot be an empty string");
    };

    if (suspendReasons == null || undefined) {
        throw new Error("argument suspendReasons missing");
    };

    if (!(suspendReasons instanceof Array)) {
        throw new Error("argument suspendReasons must be an array");
    };

    suspendReasons.forEach(reason => {
        if (!(reason instanceof String)) {
            throw new Error("suspendReasons can only contain strings");
        };
        if (reason.length == 0) {
            throw new Error("suspendReasons cannot contain an empty string");
        };
    });

    if (suspendExpirationDate == null || undefined) {
        throw new Error("argument suspendExpirationDate missing");
    };

    if (!((new Date(suspendExpirationDate)) instanceof Date)) {
        throw new Error("argument suspendExpirationDate must be a valid Date");
    };

    const htmlString = "";
    htmlString += "<h1>Fiókfelfüggesztés</h1>";
    htmlString += "<p>A " + userName + " VisualStory fiókod az alábbi okok miatt fel lett függesztve:</p>";
    htmlString += "<ul>";
    suspendReason.forEach(reason => {
        htmlString += "<li>"+ reason +"<li/>";
    });
    htmlString += "<ul/>";
    htmlString += "<p>A felfüggesztés lejárata: " + suspendExpirationDate + "</p>";
    htmlString += "<p>Ha valaki más illetéktelen hozzáférése miatt történ e felfüggesztés, a kapcsolatot csapatunkkal az alábbi linken veheted fel:</p>";
    htmlString += supportString;
    return htmlString;
};

const setEmailOptions = (targetEmail, subject, html) => {
    if (targetEmail == null || undefined) {
        throw new Error("argument targetEmail missing");
    };

    if (!(targetEmail instanceof String)) {
        throw new Error("argument targetEmail must be a string");
    };

    if (html == null || undefined) {
        throw new Error("argument text missing");
    };

    if (!(html instanceof String)) {
        throw new Error("argument text must be a string");
    };

    if (subject == null || undefined) {
        throw new Error("argument subject missing");
    };

    if (!(subject instanceof String)) {
        throw new Error("argument subject must be a string");
    };

    const data = {
        from: process.env.EMAIL_ACCOUNT,
        to: targetEmail,
        subject: subject,
        html: html
    };
    return data;
};

exports.sendResetEmail = async (userName,resetToken,targetEmail) => {

    const html = await makeResetPasswordText(userName,resetToken);
    const subject = "VisualStory " + userName + " felhasználó jelszóvisszaállítás";

    const mailOptions = setEmailOptions(targetEmail,subject,html);

    transporter.sendMail(mailOptions,(error,info) => {
        if (error) {
            console.error(error);
          } else {
            console.log('Email sent: ' + info.response);
          };
    });
};

exports.sendVerfyEmail = async (userName,verifyToken,registerDate,targetEmail) => {
    const html = await makeVerfiyRegisterText(userName,verifyToken,registerDate);
    const subject = "VisualStory " + userName + " felhasználó megerősítése";

    const mailOptions = setEmailOptions(targetEmail,subject,html);

    transporter.sendMail(mailOptions,(error,info) => {
        if (error) {
            console.error(error);
          } else {
            console.log('Email sent: ' + info.response);
          };
    });
};

exports.sendBanEmail = (userName,banReasons,targetEmail) => {
    const html = makeBannedAccountText(userName,banReasons);
    const subject = "VisualStory " + userName + " felhasználó kitiltva";

    const mailOptions = setEmailOptions(targetEmail,subject,html);

    transporter.sendMail(mailOptions,(error,info) => {
        if (error) {
            console.error(error);
          } else {
            console.log('Email sent: ' + info.response);
          };
    });
};

exports.sendSuspendEmail = (userName,suspendReasons,suspendExpirationDate,targetEmail) => {
    const html = makeSuspendedAccountText(userName,suspendReasons,suspendExpirationDate);
    const subject = "VisualStory " + userName + " felhasználó felfüggesztve";

    const mailOptions = setEmailOptions(targetEmail,subject,html);

    transporter.sendMail(mailOptions,(error,info) => {
        if (error) {
            console.error(error);
          } else {
            console.log('Email sent: ' + info.response);
          };
    });
};


