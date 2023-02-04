const session = require("express-session");
const crypto = require('crypto');
const util = require('util');

const waitPreKey = util.promisify(crypto.randomBytes)
const secretKey = (await waitPreKey(64)).toString('base64url')

var app = express()
app.use(session(
    {
        secret: secretKey,
        resave: false,
        saveUninitialized: false,
        cookie: {secure:true }
    }
))


exports.getAuth = (req,res) => {

    const userId = req.params.ID

    var cookie = new session.Cookie({
        user : userId
    })

    res.send()

}

exports.isAuth = (req,res,next) => {

    const authDetails = req.session

    if(authDetails.user == req.ID && authDetails.secret == secretKey) 
    {
        next()
    }
    else 
    {
        res.status(403).redirect('./')
    }

}

exports.authChallenge = (req,res) => {

}