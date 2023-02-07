const user = require("../models").user;
const media = require("../models").media;

exports.getUser = async (req,res,next) => 
{
    const ID = req.params.userID;

    const User = await user.findOne({where:{ID: ID}})

        res.status(200)
        .json(User);
};

exports.getProfile = async (req,res,next) => 
{
    const ID = req.params.userID

    const UserProfile = await user.findOne(
        {
            where:{ID: ID},
            attributes:['name','gender','birth_date','profile_description','profile_picture','type'],
            include:{model:media}
        }
    )
    res.status(200)
    .json(UserProfile);
}

exports.editProfile = async (req,res,next) => 
{
    const ID = req.params.userID

    const profilePicture = req.body.profile_picture;
    const profileDescription = req.body.profile_description;
    const profileVisibility = req.body.profile_visibility;

    const User = await user.findOne({where:{ID: ID}})
            await User.set(
                {
                    profile_description: profileDescription,
                    profile_visibility: profileVisibility,
                    profile_picture: profilePicture
                }
            );
            await User.save().then(
            res.send(201))
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

    const User = await user.findOne({where:{ID: ID}})
    await User.set(
        {
            password: userNewPassword
        })
    await User.save()
        .then(res.send(201))
        .catch(err => console.log(err))
}

exports.logout = async (req,res,next) => {
    res.redirect('/')
};

exports.resetPassword = async (req,res,next) => 
{
    const Name = req.body.name;

    const User =  await user.findOne({where:{Name: Name}});
        res.status(200)
        .redirect('/')
        // .json({"notificate" : "reset email sent"})
        // email.sendResetEmail(User.Email)
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
        await User.save()
        .then(
            res.status(201)
            // email.sendVerfyEmail(User.Email)
            ).catch(err => console.log(err))
       const NewUser = await user.findOne({where:{name : UserName}})
        res.redirect('/user/' +  NewUser.ID)
};

exports.deleteUser = async (req,res,next) => 
{
    const ID = req.params.userID;
    const User = await user.findOne({where:{ID: ID}});
    await user.destroy(User);
    res.status(200)
    .redirect('/') 
};