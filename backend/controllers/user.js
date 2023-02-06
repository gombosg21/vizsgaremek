const user = require("../models").user;
const util = require('util');

exports.getUser = async (req,res,next) => 
{
    const ID = req.params.ID;

    const User = await user.findOne({where:{ID: ID}});

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
    const Name = req.params.name;
    const Password = req.body.password;

    const User = await user.findOne({where:{Name: Name}});

        if( User === null )
        {
            res.status(404)
            // .json({"error":`user with id:${Name} does not exist`})
        }
        else
        {
            if (User.Password == Password)
            {
                res.status(200)
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

exports.logout = async (req,res,next) => {
    const authCookie = req.body.cookie;
}

exports.resetPassword = async (req,res,next) => 
{
    const Name = req.body.name;

    const User =  await user.findOne({where:{Name: Name}}); 

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
    const UserName = req.body.name;
    const UserPassword = req.body.password;
    const UserEmail = req.body.email;
    const UserDate = req.body.birth_date;
    const UserGender = req.body.gender;

    if ( await user.findOne({where:{name: UserName}}) != null) 
    {
        res.status(406).json({"error":"username already exists"})
    } 
    else 
    {
        const User = user.build({
            name : UserName,
            password : UserPassword,
            birth_date : UserDate,
            email : UserEmail,
            gender : UserGender
        });
        await User.save().then(
        res.status(201)
        // sendVerfyEmail(User.Email)
        )
       const NewUser = util.promisify(await user.findOne({where:{name : UserName}})).then(
            res.redirect('/user/' +  NewUser.ID)) 
    }


};

exports.deleteUser = async (req,res,next) => 
{
    const ID = req.params.ID;
    const authCookie = req.body.cookie;
    const User = await user.findOne({where:{ID: ID}})
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