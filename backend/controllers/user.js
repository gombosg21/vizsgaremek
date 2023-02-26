const user = require("../models").user;
const media = require("../models").media;
const generatePassword = require('../util/password').generatePassword;
const { Op } = require("sequelize");

exports.getProfile = async (req, res, next) => {

    const ID = req.params.userID;
    try {
        const User = await user.findOne(
            {
                where: { ID: ID }
            });

        const UserProfile = {
            name: User.name,
            register_date: User.register_date,
            gender: User.gender,
            birth_date: User.birth_date,
            profile_description: User.profile_description,
            profile_pic: User.profile_pic,
            type: User.type
        };

        //
        //  user profile visibility levels
        //  0 = private
        //  1 = friends only
        //  2 = registered only
        //  3 = public
        //
        const visibility = User.profile_visibility;
        console.log(visibility)
        switch (visibility) {
            case (0): {
                if (req.user.ID == User.ID) {
                    res.status(200)
                        .json(UserProfile);
                } else {
                    res.status(403).
                        json({ "error": "this profile is private" });
                };
                break;
            }
            case (1): {
                res.status(501)
                    .json({ "msg": "on TODO" });
                break;
            }
            case (2): {
                if (req.user) {
                    res.status(200)
                        .json(UserProfile);
                    break;
                } else {
                    res.status(401).
                        json({ "error": "this profile is for registered members only" });
                    break;
                };
            }
            case (3): {
                res.status(200)
                    .json(UserProfile);
                break;
            }
            default: {
                res.status(500)
                    .json({ "error": "error" })
            }
        };
    }
    catch (error) {
        console.error(error);
        res.status(502);
    };
};

exports.editProfile = async (req, res, next) => {

    const ID = req.user.ID;

    var profilePicture = req.body.profile_picture;
    var profileDescription = req.body.profile_description;
    var profileVisibility = req.body.profile_visibility;

    try {
        const User = await user.findByPk(ID);

        switch (null) {
            case (profilePicture == null): { profilePicture = User.profile_picture };
            case (profileDescription == null): { profileDescription = User.profile_description };
            case (profileVisibility == null): { profileVisibility = User.profile_visibility };
        };

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
        console.error(error);
        res.status(500);
    }
};

exports.login = async (req, res, next) => {

    const Name = req.body.name;

    try {
        const User = await user.findOne({ where: { Name: Name }, attributes: ['ID'] });
        res.status(200)
            .redirect('/api/v/0.1/user/' + User.ID);
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.changePassword = async (req, res, next) => {

    const ID = req.user.ID;
    const userNewPassword = req.body.new_password;

    const encryptedPassword = generatePassword(userNewPassword);
    const passwordSalt = encryptedPassword.salt;
    const passwordHash = encryptedPassword.hash;

    try {
        const User = await user.findOne({ where: { ID: ID } });
        await User.set(
            {
                password_hash: passwordHash,
                password_salt: passwordSalt
            });
        await User.save();
        res.status(200);
    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.logout = async (req, res, next) => {

    req.logout((error) => {
        if (error) {
            res.status(500);
            console.error(error);
        }
        else {
            res.redirect('/api/v/0.1/');
        }
    });
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
        console.error(error);
        res.status(500);
    }
};

exports.createUser = async (req, res, next) => {

    const UserName = req.body.name;
    const UserPassword = req.body.password;
    const UserEmail = req.body.email;
    const UserDate = req.body.birth_date;
    const UserGender = req.body.gender;

    const encryptedPassword = generatePassword(UserPassword);
    const passwordSalt = encryptedPassword.salt;
    const passwordHash = encryptedPassword.hash;

    try {
        const User = user.build({
            name: UserName,
            password_hash: passwordHash,
            password_salt: passwordSalt,
            birth_date: UserDate,
            email: UserEmail,
            gender: UserGender
        });
        await User.save();
        res.status(201);
        const NewUser = await user.findOne({ where: { name: UserName } });
        // email.sendVerfyEmail(User.Email)
        req.logIn(NewUser, async (error) => {
            if (error) {
                res.status(500);
                console.error(error);
            } else {
                res.redirect('/api/v/0.1/user/' + NewUser.ID);
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500);
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
        console.error(error);
        res.status(500);
    }
};

exports.findUser = async (req, res, next) => {

    var date = new Date();
    var day = date.getDay();
    var month = date.getMonth();
    var year = date.getFullYear();
    var currdate = new Date(year, month, day).toJSON();

    //
    //  sex
    //  0 = male
    //  1 = female
    //  2 = other/unspecified
    //

    const Name = req.query.name ?? "";
    var SDate = req.query.date_start ?? "1000-01-01";
    var EDate = req.query.date_end ?? currdate;
    var Gender = [req.query.gender][0] == undefined ? [0, 1, 2] : [req.query.gender];

    try {
        const UserList = await user.findAll({ where: { name: { [Op.substring]: Name }, birth_date: { [Op.gt]: SDate, [Op.lt]: EDate }, gender: { [Op.in]: Gender } }, attributes: ['name', 'gender', 'birth_date'] });
        if (UserList === null) {
            res.status(404).json({ "msg": "couldnt find results matching query parameters, try a different search" })
        }
        else {
            res.status(200)
                .json(UserList);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
};