const user = require("../models/user");
const session = require("express-session");

exports.getUser() = async (req,res,next) => 
{
    const Name = req.body.Name;
    const User = await user.findOne({where:{name: Name}});
    if( User === null )
    {
        res.status(404)
        .redirect('/')
    }
    else
    {
        res.status(200)
        .json(JSON.stringify(User))
    }
};

exports.getLogin() = async (req,res,next) => 
{
    const Name = req.body.Name;
    const Password = req.body.Password;
    const User = await user.findOne({where:{name: Name}});
        if( User === null )
        {
            res.status(404).send(error.noSuchUser)
        }
        else
        {
            if (User.password == Password)
            {
                res.status(201)
                .redirect('/user/' + User.ID + '/home')
            }
            else 
            {
                res.status(401)
                .redirect('/')
                .send(error.wrongCredentials)
            }
        }
};

exports.getResetPassword() = async (req,res,next) => 
{
    const Name = req.body.Name;
    const User =  await user.findOne({where:{name: Name}}); 
        if( User === null )
        {
            res.status(404)
            .redirect('/')
            .send(error.noSuchUser)
        }
        else
        {
            res.status(200)
            .redirect('/')
            .send(notify.resetEmailSent)
            sendResetEmail(User.Email)
        }
};

exports.postCreateUser() = async (req,res,next) => 
{
    const UserName = req.body.Name;
    const UserPassword = req.body.Password;
    const UserEmail = req.body.Email;
    const UserAge = req.body.Age;

    const User = new user({
            Name : UserName,
            Password : UserPassword,
            Age : UserAge,
            Email : UserEmail,
        });
        User.save()
        sendVerfyEmail(User.Email)
        res.status(201)
        .send(notify.confirmEmailSent)
        .redirect('user/' +  User.ID + '/home')
};

exports.deleteDeleteUser() = async (req,res,next) => 
{
    const Name = req.body.Name;
    const authCookie = req.body.cookie;
    const User = await user.findOne({where:{name: Name}})
        if( User === null )
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
};