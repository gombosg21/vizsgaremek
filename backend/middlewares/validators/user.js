const vailadtor = require('express-vailadtor');

exports.validateEmail = (email) => {
   return vailadtor.check(email).isEmail();
}

exports.validatePassword = (password) => {

    var regex = '/^[0-9a-zA-Z]+$/'
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