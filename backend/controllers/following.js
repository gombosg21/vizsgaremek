const followed = require("../models").followed;
const activity = require("../models").activity;
const { Op } = require("sequelize");

exports.getFollowedList = async (req, res, next) => {
    const userID = req.user.ID;
    try {
        const followedList = await followed.findAll({ where: { user_ID: userID }, attributes: ['date', ['followed_ID', 'ID']] });

        if (!followedList) {
            return res.status(200).json({ followed_list: "user does not follow anyone" });
        };

        return res.status(200).json(followedList);
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getFollowerCount = async (req, res, next) => {
    const userID = req.params.userID;
    try {
        const followedCount = await followed.count({ where: { followed_ID: userID } });

        return res.status(200).json(followedCount);
    } catch (error) {
        console.error(error);
        return res.status(500);
    };

};

exports.sub = async (req, res, next) => {
    const userID = req.user.ID;
    const subID = req.params.userID;
    try {
        const userFollowingsRaw = await followed.findAll({ where: { user_ID: userID } });

        if (userFollowingsRaw) {
            const userFollowings = userFollowingsRaw.map(Followed => Followed.followed_ID);

            if (userFollowings.includes(Number(subID))) {
                return res.status(400).json({ error: `user is already subbed to user with id: ${subID}` });
            };
        };

        const newFollowing = await followed.create({
            user_ID: userID,
            followed_ID: subID,
            date: Date.now()
        });

        await activity.create({
            user_ID: userID,
            followed_ID: subID
        });

        return res.status(201).json({ ID: newFollowing.followed_ID, date: newFollowing.date });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };

};

exports.unSub = async (req, res, next) => {
    const userID = req.user.ID;
    const subID = req.params.userID;
    try {
        const deleteFollowing = await followed.findOne({ where: { [Op.and]: [{ user_ID: userID }, { followed_ID: subID }] } });

        if (!deleteFollowing) {
            return res.status(400).json({ error: `user does not follow user with id: ${subID}` })
        };

        const activityInstance = await activity.findOne({ where: { [Op.and]: [{ user_ID: userID }, { followed_ID: subID }, { friend_ID: null }] } });

        await activityInstance.destroy();

        await deleteFollowing.destroy();

        return res.status(200).json({ ID: deleteFollowing.followed_ID, date: deleteFollowing.date });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};