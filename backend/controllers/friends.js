const user = require("../models").user;
const friend = require("../models").friend;
const { Op } = require("sequelize");

exports.requestFriend = async (req, res, next) => {
    const userID = req.user.ID;
    const friendID = req.body.id;

    try {
        const newFriend = await friend.create({
            user_ID: userID,
            friend_ID: friendID,
            date: Date.now(),
            pending: true
        });

        return res.status(201).json({ new_friend: newFriend });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getPendingFriends = async (req, res, next) => {
    const userID = req.user.ID;

    try {
        const pendingList = await friend.findAll({ where: { [Op.and]: [{ pending: true }, { user_ID: userID }] }, attributes: ['date', 'friend_ID'] });

        return res.status(200).json({ pending_friends: pendingList });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.verifyFriend = async (req, res, next) => {
    const userID = req.user.ID;
    const friendID = req.body.id;
    try {
        const updateFriend = await friend.findOne({ where: { [Op.and]: [{ user_ID: userID }, { friend_ID: friendID }] } });
        updateFriend.set({
            pending: false,
            date: Date.now()
        });

        return res.status(200).json({ friend: updateFriend });

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.removeFrined = async (req, res, next) => {
    const userID = req.user.ID;
    const friendID = req.body.id;
    try {
        const deleteFriend = await friend.findOne({ where: { [Op.and]: [{ user_ID: userID }, { friend_ID: friendID }] } });
        await deleteFriend.destroy();
        res.status(200).json({ deleted: deleteFriend })
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getFriends = async (req, res, next) => {
    const userID = req.user.ID;
    try {
        const friendList = await friend.findAll({ where: { user_ID: userID }, group: 'user_ID' });

        res.status(200).json({ friend_list: friendList });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};