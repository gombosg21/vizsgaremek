const vailadtor = require('express-validator');


exports.validateEmail = (email) => {
    if(vailadtor.check(email).isEmail()) 
    {
        next();
    } 
    else
    {
        res.status(406)
        .json({"error":"invalid email"})
        return;
    }
   ;
}

exports.validatePassword = (req,res,next) => {

    const password = req.body.password;
    const minLenght = 8;
    const maxLenght = 32;

    const regex = new RegExp("/^[0-9]+[a-z]+[A-Z]+$/")
    
    if(password.lenght() < minLenght && password.lenght() > maxLenght) 
    {
       if (password.test(regex)) 
       {
            next();
       } 
       else 
       {
        res.status(406)
        .json({"error":"password must contain least one capital letter, one number and one special character"})
        return;
       }
    } 
    else
    {
        res.status(406)
        .json({"error":`password must be whitin ${minLenght} and ${maxLenght} charaters long.`})
        return;
    }
};

exports.checkIfNameExsits = async (req,res,next) => 
{
    const UserName = req.body.name;

    if(await user.findOne({where:{name: UserName}}) != null) 
    {
        res.status(406)
        .json({"error":"username already exists"})
        return;
    } else 
    {
        next();
    }
}