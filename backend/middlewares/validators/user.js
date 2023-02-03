const vailadtor = require('express-validator');


exports.validateEmail = (email) => {
   return vailadtor.check(email).isEmail();
}

exports.validatePassword = (password) => {

    const regex = new RegExp("/^[0-9]+[a-z]+[A-Z]+$/")
    if(password.lenght() < 8 && password.lenght() > 32) 
    {
       if (password.test(regex)) 
       {
            return "ok"
       } 
       else 
       {
            return "char"
       }
    } 
    else
    {
        return "lenght"
    }
};