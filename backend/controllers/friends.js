const friend = require("../models").friends;
const { Op } = require("sequelize");

exports.requestFriend = async (req, res, next) => {
    const userID = req.user.ID;
    const friendID = req.params.userID;

    try {
        const newFriend = await friend.create({
            user_ID: userID,
            friend_ID: friendID,
            date: Date.now(),
            pending: true
        });

        return res.status(201).json({ id: newFriend.friendID, pending: newFriend.pending, date: newFriend.date });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getPendingFriends = async (req, res, next) => {
    const userID = req.user.ID;

    try {
        const pendingList = await friend.findAll({ where: { [Op.and]: [{ pending: true }, { friend_ID: userID }] }, attributes: ['date', 'friend_ID'] });

        return res.status(200).json({ pending_friends: pendingList });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.verifyFriend = async (req, res, next) => {
    const userID = req.user.ID;
    const friendID = req.params.userID;

    try {
        const updateFriend = await friend.findOne({ where: { [Op.and]: [{ user_ID: friendID }, { friend_ID: userID }] } });
        updateFriend.set({
            user_ID: updateFriend.user_ID,
            friend_ID: updateFriend.friend_ID,
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
    const friendID = req.params.userID;

    try {
        const deleteFriend = await friend.findOne({ where: { [Op.and]: [{ user_ID: userID }, { friend_ID: friendID }] } });
        if (deleteFriend) {
            await deleteFriend.destroy();
            return res.status(200).json({ deleted: deleteFriend.friend_ID });
        } else {
            const deleteFriend2 = await friend.findOne({ where: { [Op.and]: [{ user_ID: friendID }, { friend_ID: userID }] } });
            await deleteFriend2.destroy();
            return res.status(200).json({ deleted: deleteFriend2.friend_ID });
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getFriends = async (req, res, next) => {
    const userID = req.params.userID;
    try {
        const friendList = await friend.findAll({
            where: {
                [Op.and]: [{
                    [Op.or]:
                        [
                            { user_ID: userID },
                            { friend_ID: userID }
                        ]
                },
                { pending: false }]
            }, attributes: { exclude: ['pending'] }, group: 'user_ID'
        });

        const friends = [];

        friendList.forEach(Friend => {
            var FormattedFriend = {
                date: Friend.date
            };
            if(Friend.user_ID != userID) {
                FormattedFriend.id = Friend.user_ID;
            } else {
                FormattedFriend.id = Friend.friend_ID;
            };
            friends.push(FormattedFriend)
        });

        return res.status(200).json({ friend_list: friends });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};