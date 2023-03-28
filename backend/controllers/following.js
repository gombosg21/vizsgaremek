const user = require("../models").user;
const followed = require("../models").followed;

exports.getFollowedList = async (req, res, next) => {
    const userID = req.user.ID;
    try {
        const followedList = await followed.findALl({ where: { user_ID: userID } });

        return res.status(200).json({ followed_list: followedList });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getFollowerCount = async (req, res, next) => {
    const userID = req.user.ID;
    try {
        const followedCount = await followed.count({ where: { followed_ID: userID } });

        return res.status(200).json({ followers: followedCount });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };

};

exports.sub = async (req, res, next) => {
    const userID = req.user.ID;
    const subID = req.body.id;
    try {
        const newFollowing = await followed.create({
            user_ID: userID,
            followed_ID: subID,
            date: Date.now()
        });

        return res.status(201).json({ subbed: newFollowing });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };

};

exports.unSub = async (req, res, next) => {
    const userID = req.user.ID;
    const subID = req.body.id;
    try {
        const deleteFollowing = await followed.findOne({ where: { [Op.and]: [{ user_ID: userID }, { followed_ID: subID }] } });
        await deleteFollowing.destroy();

        return res.status(200).json({ unsubbed: deleteFollowing });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};