const user = require("../models").user;
const media = require("../models").media;
const { Op } = require("sequelize");

exports.getProfile = async (req, res, next) => {

    const ID = req.params.userID;

    try {
        const UserProfile = await user.findOne(
            {
                where: { ID: ID },
                attributes: ['name', 'register_date', 'gender', 'birth_date', 'profile_description', 'profile_pic', 'type'],
                include: { model: media }
            });
        res.status(200)
            .json(UserProfile);
    }
    catch (error) {
        console.log(error);
        res.status(502);
    }
};

exports.editProfile = async (req, res, next) => {

    const ID = req.params.userID;

    var profilePicture = req.body.profile_picture;
    var profileDescription = req.body.profile_description;
    var profileVisibility = req.body.profile_visibility;

    try {
        const User = await user.findOne({ where: { ID: ID } });

        switch (null) {
            case (profilePicture == null): { profilePicture = User.profile_picture };
            case (profileDescription == null): { profileDescription = User.profile_description };
            case (profileVisibility == null): { profileVisibility = User.profile_visibility };
        }

        await User.set(
            {
                profile_description: profileDescription,
                profile_visibility: profileVisibility,
                profile_picture: profilePicture
            }
        );
        await User.save();
        res.status(200)
            .json(User.ID);
    }
    catch (error) {
        console.log(error);
        res.status(502);
    }
};

exports.login = async (req, res, next) => {

    const Name = req.params.name;
    const Password = req.body.password;

    const User = await user.findOne({ where: { Name: Name } });

    try {
        if (User.Password == Password) {
            res.status(200)
                .redirect('/api/v/0.1/user/' + User.ID);
        }
        else {
            res.status(401)
                .redirect('/')
                .json("bad password");
        }
    }
    catch (error) {
        console.log(error);
        res.status(502);
    }
};

exports.changePassword = async (req, res, next) => {

    const userNewPassword = req.body.password;

    try {
        const User = await user.findOne({ where: { ID: ID } });
        await User.set(
            {
                password: userNewPassword
            });
        await User.save();
        res.status(200);
    }
    catch (error) {
        console.log(error);
        res.status(502);
    }

}

exports.logout = async (req, res, next) => {
    res.redirect('/');
};

exports.resetPassword = async (req, res, next) => {

    const Name = req.body.name;

    try {
        const User = await user.findOne({ where: { Name: Name } });
        res.status(200)
            .redirect('/');
        // .json({"notificate" : "reset email sent"})
        // email.sendResetEmail(User.Email)
    }
    catch (error) {
        console.log(error);
        res.status(502);
    }
};

exports.createUser = async (req, res, next) => {

    const UserName = req.body.name;
    const UserPassword = req.body.password;
    const UserEmail = req.body.email;
    const UserDate = req.body.birth_date;
    const UserGender = req.body.gender;

    try {
        const User = user.build({
            name: UserName,
            password: UserPassword,
            birth_date: UserDate,
            email: UserEmail,
            gender: UserGender
        });
        await User.save();
        res.status(201);
        // email.sendVerfyEmail(User.Email)

        const NewUser = await user.findOne({ where: { name: UserName } });
        res.redirect('/api/v/0.1/user/' + NewUser.ID);
    }
    catch (error) {
        console.log(error);
        res.status(502);
    }
};

exports.deleteUser = async (req, res, next) => {

    const ID = req.params.userID;

    try {
        const User = await user.findOne({ where: { ID: ID } });
        User.set({
            deleted: true
        })
        await User.destroy();
        res.json(User.ID)
            .redirect('/');
    }
    catch (error) {
        console.log(error);
        res.status(502);
    }
};

exports.findUser = async (req, res, next) => {
        var date = new Date();
        var day = date.getDay();
        var month = date.getMonth();
        var year = date.getFullYear();
        var currdate = new Date(year, month, day).toJSON();

    const Name =  req.query.name ?? "";
    var SDate = req.query.date_start ?? "1000-01-01";
    var EDate = req.query.date_end ?? currdate;
    var Gender = [req.query.gender][0] == undefined ? [0,1,2] : [req.query.gender];

    try {
        const UserList = await user.findAll({ where: { name: { [Op.like]: `%${Name}%` }, birth_date: { [Op.gt]: SDate, [Op.lt]: EDate }, gender: { [Op.in]: Gender } },attributes:['name','gender','birth_date'] });
        if (UserList === null) {
            res.status(404).json({ "msg": "couldnt find results matching query parameters, try a different search" })
        }
        else {
            res.status(200)
                .json(UserList);
        }
    }
    catch (error) {
        console.log(error);
        res.status(502);
    }
}