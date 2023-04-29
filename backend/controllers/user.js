const user = require("../models").user;
const media = require("../models").media;
const thread = require("../models").thread;
const profile = require("../models").profile;
const comment = require("../models").comment;
const comment_reactionlist = require("../models").comment_reactionlist;
const thread_reactionlist = require("../models").thread_reactionlist;
const profile_reactionlist = require("../models").profile_reactionlist;
const { Op, fn, col } = require("sequelize");
const Visibility = require('../helpers/authorization/visibility').determineVisibility;
const getJWT = require("../util/auth").generateJWT;
const validatePassword = require('../util/auth').validatePassword;

exports.getProfile = async (req, res, next) => {
    const ID = req.params.userID;

    var userID = -1;
    if (req.user) {
        userID = req.user.ID;
    };

    try {
        const User = await user.findByPk(ID, {
            attributes: ['ID', 'register_date', 'gender', 'birth_date', 'type'],
            include: [{
                model: profile,
                attributes: ["alias", "description", "visibility", "picture_ID"],
                include: [
                    {
                        model: media,
                        attributes: ['file_data']
                    }, {
                        model: thread,
                        attributes: ['ID', 'name', 'status', 'created', 'last_activity'],
                        include: [
                            {
                                model: comment,
                                attributes: ['content', 'ID', 'created', 'last_edit'],
                                include: [
                                    {
                                        model: user,
                                        attributes: ['ID'],
                                        include: [{ model: profile, attributes: ['alias'] }]
                                    }
                                ]
                            },
                        ]
                    }
                ]
            }],
        });

        if (User.dataValues.profile.thread.comments) {
            const commentIDs = User.dataValues.profile.thread.comments.map(comment => comment.ID);

            const comment_reactions = await comment_reactionlist.findAll({
                where: { comment_ID: { [Op.in]: commentIDs } },
                attributes: [['reaction_ID', 'ID'], "comment_ID", [fn('COUNT', 'reaction_ID'), 'count']],
                group: [col('reaction_ID'), col("comment_ID")]
            });

            for (let i = 0; i < User.dataValues.profile.thread.comments.length; i++) {
                User.dataValues.profile.thread.comments[i].reactions = [];
                for (let j = 0; j < comment_reactions.length; j++) {
                    if (comment_reactions[j].comment_ID == User.dataValues.profile.thread.comments[i].ID) {
                        User.dataValues.profile.thread.comments[i].reactions.push({
                            ID: comment_reactions.ID,
                            count: comment_reactions.count
                        });
                    };
                };
            };
        };



        const profile_reactions = await profile_reactionlist.findAll({
            where: { profile_ID: User.ID },
            attributes: [['reaction_ID', 'ID'], [fn('COUNT', 'reaction_ID'), 'count']],
            group: [col('reaction_ID')]
        });

        const thread_reactions = await thread_reactionlist.findAll({
            where: { thread_ID: User.profile.thread.ID },
            attributes: [['reaction_ID', 'ID'], [fn('COUNT', 'reaction_ID'), 'count']],
            group: [col('reaction_ID')]
        });

        User.dataValues.profile.reactions = profile_reactions.dataValues;
        User.dataValues.profile.thread.reactions = thread_reactions.dataValues;

        const visibility = User.profile.visibility;

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
        const UserProfile = await profile.findByPk(ID);
        var CurrDate = Date.now()
        var lastUpdate = Date(UserProfile.last_updated);
        if ((lastUpdate + (60 * 5)) < CurrDate) {
            await UserProfile.update({
                profile_description: profileDescription ?? UserProfile.profile_picture,
                profile_visibility: profileVisibility ?? UserProfile.profile_visibility,
                profile_picture: profilePicture ?? UserProfile.profilePicture,
                alias: userAlias ?? UserProfile.alias,
                last_updated: Date.now()
            });

            if (userAlias) {
                await thread.update({ name: UserProfile.alias + "'s profile thread" }, { where: { profile_ID: UserProfile.ID } });
            };

            return res.status(200).json({ ID: UserProfile.ID });
        } else {
            return res.status(400).json({ error: "cannot update, last update was less than 5 minutes ago" });
        };

    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.login = async (req, res, next) => {
    const Name = req.body.name;
    const password = req.body.password;

    try {

        if (!password || !Name) { return res.status(401).json({ error: "missing or partial credentials" }) };
        const User = await user.findOne({ where: { Name: Name }, attributes: ['ID', 'password'] });
        if (!User) {
            return res.status(400).json({ error: "bad username or password" });
        };

        const vaildPassword = await validatePassword(password, User.password);

        const tokenResults = await getJWT(User.ID);

        if (vaildPassword) {
            return res.status(200).json({ ID: User.ID, token: tokenResults.token, token_expires: tokenResults.expires });
        };

        return res.status(403).json({ error: "bad username or password" });

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.refresh = async (req, res, next) => {
    try {
        const ID = req.user.ID;

        const tokenResults = await getJWT(ID);

        return res.status(200).json({ token: tokenResults.token, token_expires: tokenResults.expires })

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

        // TODO blacklist incoming token till expiry.
        return res.status(200).json({ message: "logout succesfull" });

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

        // TODO finish email module
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

        await profile.create({
            user_ID: User.ID,
            alias: User.name,
            last_updated: Date.now()
        })

        await thread.create({
            user_ID: User.ID,
            profile_ID: User.ID,
            name: User.name + "'s profile thread"
        });

        // email.sendVerfyEmail(User.Email);

        const tokenResults = getJWT(User.ID);

        return res.status(201).json({ ID: User.ID, token: tokenResults.token, token_expires: tokenResults.expires });
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
        const UserList = await user.findAll(
            {
                where: {
                    birth_date: { [Op.gt]: SDate, [Op.lt]: EDate },
                    gender: { [Op.in]: Gender }
                },
                attributes: ['ID', 'gender', 'birth_date'],
                include: [
                    {
                        model: profile,
                        attributes: ['alias'],
                        where: {
                            alias: { [Op.substring]: Alias }
                        }
                    }]
            });

        return res.status(200).json({ results: UserList });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};