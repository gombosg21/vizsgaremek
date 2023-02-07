const user = require("../models").user;
const media = require("../models").media;
const util = require('util');

exports.getUser = async (req,res,next) => 
{
    const ID = req.params.userID;

    const User = util.promisify(await user.findOne({where:{ID: ID}}))
    .then(
        res.status(200)
        .json(User)
        )
        .catch(err => console.log(err));
};

exports.getProfile = async (req,res,next) => 
{
    const ID = req.params.userID

    const UserProfile = util.promisify(await user.findOne(
        {
            where:{ID: ID},
            attributes:['name','gender','birth_date','profile_description','profile_picture','type'],
            include:{model:media}
        }
    ))
    .then(
        res.status(200)
        .json(UserProfile)
        )
        .catch(err => console.log(err));
}

exports.editProfile = async (req,res,next) => 
{
    const ID = req.params.userID

    const profilePicture = req.body.profile_picture;
    const profileDescription = req.body.profile_description;
    const profileVisibility = req.body.profile_visibility;

    const User = util.promisify(await user.findOne({where:{ID: ID}}))
        .then(
            util.promisify(await User.set(
                {
                    profile_description: profileDescription,
                    profile_visibility: profileVisibility,
                    profile_picture: profilePicture
                }
            ).then(util.promisify(User.save))
            .then(res.send(201))
    ))
    .catch(err => console.log(err))
    

}

exports.login = async (req,res,next) => 
{
    const Name = req.params.name;
    const Password = req.body.password;

    const User = await user.findOne({where:{Name: Name}});

    if (User.Password == Password) 
    {
        res.status(200)
            .redirect('/user/' + User.ID)
    }
    else 
    {
        res.status(401)
            .redirect('/')
            .json("bad password")
    }
};

exports.changePassword = async (req,res,next) => 
{
    const userNewPassword = req.body.password

    const User = util.promisify(await user.findOne({where:{ID: ID}}))
        .then(
            util.promisify(await User.set({
                password: userNewPassword
            })).then(util.promisify(User.save))
                .then(res.send(201))
        )
        .catch(err => console.log(err))
}

exports.logout = async (req,res,next) => {
    res.redirect('/')
};

exports.resetPassword = async (req,res,next) => 
{
    const Name = req.body.name;

    const User =  util.promisify(await user.findOne({where:{Name: Name}}))
    .then(
        res.status(200)
        .redirect('/')
        // .json({"notificate" : "reset email sent"})
        // email.sendResetEmail(User.Email)
        ).catch(err => console.log(err))
};

exports.createUser = async (req,res,next) => 
{
    const UserName = req.body.name;
    const UserPassword = req.body.password;
    const UserEmail = req.body.email;
    const UserDate = req.body.birth_date;
    const UserGender = req.body.gender;
        const User = user.build({
            name : UserName,
            password : UserPassword,
            birth_date : UserDate,
            email : UserEmail,
            gender : UserGender
        });
        util.promisify(await User.save())
        .then(
            res.status(201)
            // email.sendVerfyEmail(User.Email)
            ).catch(err => console.log(err))
       const NewUser = util.promisify(await user.findOne({where:{name : UserName}}))
       .then(
            res.redirect('/user/' +  NewUser.ID)
            ) .catch(err => console.log(err))
};

exports.deleteUser = async (req,res,next) => 
{
    const ID = req.params.userID;
    const User = await user.findOne({where:{ID: ID}})
    .then(
        await user.destroy(User))
        .then(
            res.status(200)
            .redirect('/')
            ).catch(err => console.log(err))

};