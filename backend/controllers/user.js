const user = require("../models").user;
const media = require("../models").media;
const thread = require("../models").thread;
const comment = require("../models").comment;
const reaction = require("../models").reaction;
const { Op } = require("sequelize");
const Visibility = require('../helpers/authorization/visibility').determineVisibility;

exports.getProfile = async (req, res, next) => {
    const ID = req.params.userID;

    var userID = -1;
    if (req.user) {
        userID = req.user.ID;
    };

    try {
        const User = await user.findByPk(ID, { attributes: ['profile_visibility', 'ID', 'alias', 'register_date', 'gender', 'birth_date', 'profile_description', 'profile_pic', 'type'] });
        const profileThread = await thread.findOne({ where: { profile_ID: ID }, include: [{ model: comment }] });

        const profilePicId = User.profile_pic;

        let ProfilePic = null;
        if (profilePicId != null) {
            ProfilePic = await media.findOne({ where: { ID: profilePicId }, attributes: ['file_data'] });
        };

        User.dataValues.profile_pic = ProfilePic;
        User.dataValues.profile_thread = profileThread;

        // const UserProfile = {
        //     ID: user.ID,
        //     alias: User.alias,
        //     register_date: User.register_date,
        //     gender: User.gender,
        //     birth_date: User.birth_date,
        //     profile_description: User.profile_description,
        //     profile_pic: ProfilePic,
        //     type: User.type
        // };

        const visibility = User.profile_visibility;

        const results = await Visibility(userID, User.ID, visibility, User.dataValues);

        return res.status(results.status).json(results.data);
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.editProfile = async (req, res, next) => {

    const ID = req.user.ID;

    const profilePicture = req.body.profile_picture;
    const profileDescription = req.body.profile_description;
    const profileVisibility = req.body.profile_visibility;
    const userAlias = req.body.alias;

    try {
        const User = await user.findByPk(ID);

        await User.update({
            profile_description: profileDescription ?? User.profile_picture,
            profile_visibility: profileVisibility ?? User.profile_visibility,
            profile_picture: profilePicture ?? User.profilePicture,
            alias: userAlias ?? User.alias
        });

        if (userAlias) {
            await thread.update({ name: User.alias + "'s profile thread" }, { where: { profile_ID: User.ID } });
        };

        return res.status(200).json({ ID: User.ID });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.login = async (req, res, next) => {
    const Name = req.body.name;

    try {
        const User = await user.findOne({ where: { Name: Name }, attributes: ['ID'] });
        return res.status(200).json({ ID: User.ID });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.changePassword = async (req, res, next) => {
    const ID = req.user.ID;
    const userNewPassword = req.body.new_password;

    try {
        const User = await user.update({ where: { ID: ID } }, {
            password: userNewPassword,
        });

        await User.save();

        return res.status(200).json({ ID: User.ID, new_password: password });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.logout = async (req, res, next) => {
    try {
        req.logOut((error) => {
            if (error) {
                return res.status(500).json({ "error": error.message });
            } else {
                req.session.destroy((error) => {
                    if (error) {
                        return res.status(500).json({ "error": error.message });
                    } else {
                        return res.redirect('/api/v/0.1/');
                    };
                });
            };
        });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.resetPassword = async (req, res, next) => {
    const Name = req.body.name;

    try {
        const User = await user.findOne({ where: { Name: Name } });
        return res.status(200).json({ message: "reset email sent." });
        // email.sendResetEmail(User.ID);
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.createUser = async (req, res, next) => {
    const UserName = req.body.name;
    const UserPassword = req.body.password;
    const UserEmail = req.body.email;
    const UserDate = req.body.birth_date;
    const UserGender = req.body.gender;

    //
    //  sex
    //  0 = male
    //  1 = female
    //  2 = other/unspecified
    //
    try {

        const User = await user.create({
            name: UserName,
            password: UserPassword,
            birth_date: UserDate,
            email: UserEmail,
            gender: UserGender
        });

        await thread.create({
            user_ID: User.ID,
            profile_ID: User.ID,
            name: User.alias + "'s profile thread"
        });

        // email.sendVerfyEmail(User.Email);
        req.logIn(User, async (error) => {
            if (error) {
                console.error(error);
                return res.status(500);
            } else {
                return res.status(201).json({ ID: User.ID });
            };
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.deleteUser = async (req, res, next) => {
    const ID = req.user.ID;

    try {
        const User = await user.findByPk(ID);

        req.logout(User, async (error) => {
            if (error) {
                console.error(error);
                return res.status(500);
            } else {
                await User.destroy();
                return res.json({ ID: User.ID });
            };
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
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

    const Alias = req.query.alias ?? "";
    var SDate = req.query.date_start ?? "1000-01-01";
    var EDate = req.query.date_end ?? currdate;
    var Gender = [req.query.gender][0] == undefined ? [0, 1, 2] : [req.query.gender];

    try {
        const UserList = await user.findAll({ where: { alias: { [Op.substring]: Alias }, birth_date: { [Op.gt]: SDate, [Op.lt]: EDate }, gender: { [Op.in]: Gender } }, attributes: ['ID', 'alias', 'gender', 'birth_date'] });

        return res.status(200).json({ results: UserList });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};