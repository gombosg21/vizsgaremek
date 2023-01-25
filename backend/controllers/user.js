const user = require("../models/user");
const session = require("express-session");

exports.getUser(Name) = (req,res,next) => 
{
    User = user.FindByName(Name)
    .then( User => {
        if( User == false )
        {
            res.status(404)
            .redirect('/')
        }
        else
        {
            res.status(200)
            .json(User)
        }
    })
};

exports.postLogin(Name,Password) = (req,res,next) => 
{
    User = user.FindByName(Name)
    .then( User => {
        if( User == false )
        {
            res.status(404).send(error.noSuchUser)
        }
        else
        {
            if (User.password == Password)
            {
                res.status(201)
                .cookie('login-token',User.ID + User.Session, 
                {
                    expires: 0,
                })
                .redirect('/user/' + User.ID + '/home')
            }
            else 
            {
                res.status(401)
                .redirect('/')
            }
        }
    })
};

exports.postResetPassword(Name) = (req,res,next) => 
{
    User = user.FindByName(Name)
    .then( User => {
        if( User == false )
        {
            res.status(404)
            .redirect('/')
        }
        else
        {
            res.status(200)
            .redirect('/');
            user.sendResetEmail()
        }
    })
};

exports.postCreateUser(Name,Password,Email,Age) = (req,res,next) => 
{
    const UserName = Name;
    const UserPassword = Password;
    const UserEmail = Email;
    const UserAge = Age;

    User = new user({
            Name : UserName,
            Password : UserPassword,
            Age : UserAge,
            Email : UserEmail,
        });
        user.save()
    User = User.FindByName(User.Name);
    User.sendVerfyEmail()
        res.status(201)
        .send()
        .redirect('user/' +  User.ID + '/home')
};

exports.postDeleteUser(Name) = (req,res,next) => 
{
    User = user.FindByName(Name)
    .then( User => {
        if( User == false )
        {
            res.status(404).send(error.noSuchUser)
            .redirect('/')
        }
        else
        {
            res.status(200)
            .redirect('/')
            user.Delete(User)
        }
    })
};