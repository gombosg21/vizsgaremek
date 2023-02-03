const user = require("../models/user");
const session = require("express-session");
const userVerifier = require("../middlewares/validators/user");

exports.getUser = async (req,res,next) => 
{
    const ID = req.params.ID;
    const authCookie = req.body.cookie;

    const User = await user.findOne({where:{id: ID}});

    if( User === null )
    {
        res.status(404)
        .redirect('/')
        // .json({"error":`user with id:${ID} does not exist`})
    }
    else
    {
        res.status(200)
        .json(User)
    }
};

exports.login = async (req,res,next) => 
{
    const Name = req.params.Name;
    const Password = req.body.Password;

    const User = await user.findOne({where:{name: Name}});

        if( User === null )
        {
            res.status(404)
            // .json({"error":`user with id:${Name} does not exist`})
        }
        else
        {
            if (User.password == Password)
            {
                res.status(200)
                // .cookie(session.Cookie(
                //
                // ))
                .redirect('/user/' + User.ID)
            }
            else 
            {
                res.status(401)
                .redirect('/')
                // .send(error.wrongCredentials)
            }
        }
};

exports.resetPassword = async (req,res,next) => 
{
    const Name = req.body.Name;

    const User =  await user.findOne({where:{name: Name}}); 

        if( User === null )
        {
            res.status(404)
            .redirect('/')
            // .json({"error" : `user with name:${Name} does not exist`})
        }
        else
        {
            res.status(200)
            .redirect('/')
            // .json({"notificate" : "reset email sent"})
            // sendResetEmail(User.Email)
        }
};

exports.createUser = async (req,res,next) => 
{
    const UserName = req.body.Name;
    const UserPassword = req.body.Password;
    const UserEmail = req.body.Email;
    const UserAge = req.body.Age;

    const User = user.build({
            Name : UserName,
            Password : UserPassword,
            Age : UserAge,
            Email : UserEmail,
        });
        await User.save();
        // sendVerfyEmail(User.Email)
        res.status(201)
        // .json({"notificate":"confirmation email sent"})
        .redirect('user/' +  User.ID)
};

exports.deleteUser = async (req,res,next) => 
{
    const ID = req.params.ID;
    const authCookie = req.body.cookie;
    const User = await user.findOne({where:{id: ID}})
        if( User === null )
        {
            res.status(404)
            // .json({"error":`user wiht id:${ID} does not exist`})
            .redirect('/')
        }
        else
        {
            await user.destroy(User);
            res.status(200)
            .redirect('/')
        }
};