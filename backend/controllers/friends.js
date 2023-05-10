const friend = require("../models").friends;
const activity = require("../models").activity;
const user = require("../models").user;
const profile = require("../models").profile;
const { Op } = require("sequelize");

exports.requestFriend = async (req, res, next) => {
    const userID = req.user.ID;
    const friendID = req.params.userID;

    try {
        const userFriendList = friend.findAll({ where: { [Op.or]: [{ user_ID: friendID, friend_ID: userID }, { friend_ID: userID, user_ID: friendID }] } });

        if (userFriendList) {
            return res.status(400).json({ error: `cannot request friendship from user with id: ${friendID}, friendship ehiter already exsits or is pending` });
        };

        const newFriend = await friend.create({
            user_ID: userID,
            friend_ID: friendID,
            date: Date.now(),
            pending: true
        });

        const PendingInstance = await user.findByPK(newFriend.friend_ID, { attributes: ['ID'], include: { model: profile, attributes: ['alias'] } });
        PendingInstance.pending = newFriend.pending;
        PendingInstance.date = newFriend.date;

        return res.status(201).json(PendingInstance);
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getPendingFriends = async (req, res, next) => {
    const userID = req.user.ID;

    try {
        const pendingListRaw = await friend.findAll({
            where: { [Op.and]: [{ pending: true }, { friend_ID: userID }] },
            attributes: ['date', 'user_ID'],
        });

        const pendingIDs = pendingListRaw.map(item => item.friend_ID);


        if (pendingIDs.length != 0) {
            const pendingList = await user.findAll({
                where: { ID: { [Op.in]: pendingIDs } },
                attributes: ['ID'],
                include:
                    [
                        { model: profile, attributes: ['alias'] }
                    ]
            });

            const result = [];
            pendingList.forEach(element => {
                pendingListRaw.forEach(secondElement => {
                    if (element.ID == secondElement.user_ID) {
                        result.push({ ID: element.ID, profile: { alias: element.profile.alias }, date: secondElement.date, pending: true });
                    };
                });
            });

            return res.status(200).json(result);
        } else {
            return res.status(200).json([]);
        };

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.verifyFriendRequest = async (req, res, next) => {
    const userID = req.user.ID;
    const friendID = req.params.userID;

    try {
        const updateFriend = await friend.findOne({ where: { [Op.and]: [{ user_ID: friendID }, { friend_ID: userID }, { pending: true }] }, attributes: [['user_ID', 'ID'], 'date'] });

        if (!updateFriend) {
            return res.status(400).json({ error: `cannot accept, user has no pending friend request with id of ${friendID}` });
        };

        await updateFriend.update({
            pending: false,
            date: Date.now()
        });

        await activity.create({
            user_ID: userID,
            friend_ID: friendID
        });

        await activity.create({
            user_ID: friendID,
            friend_ID: userID
        });

        const verifiedfriend = await user.findByPK(updateFriend.user_ID, { attributes: ['ID'], include: [{ model: profile, attributes: ['alias'] }] });
        verifiedfriend.date = updateFriend.date;

        return res.status(200).json(verifiedfriend);

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.rejectFriendRequest = async (req, res, next) => {
    const userID = req.user.ID;
    const friendID = req.params.userID;
    try {

        const rejectFriend = await friend.findOne({ where: { [Op.and]: [{ user_ID: friendID }, { friend_ID: userID }, { pending: true }] }, attributes: ['user_ID', 'date','pending'] });

        if (!rejectFriend) {
            return res.status(400).json({ error: `cannot reject, user has no pending friend request with id of  ${friendID}` });
        };

        const rejectedFriend = await user.findByPK(rejectFriend.user_ID,{ attributes: ['ID'], include: [{ model: profile, attributes: ['alias'] }] });
        rejectedFriend.date = rejectFriend.date;
        rejectedFriend.pending = rejectFriend.pending;

        await rejectFriend.destroy();

        return res.status(200).json(rejectedFriend);

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
            const activityInstanceOne = await activity.findOne({ where: { [Op.and]: [{ user_ID: userID }, { friend_ID: friendID }, { followed_ID: null }] } });
            const activityInstanceTwo = await activity.findOne({ where: { [Op.and]: [{ user_ID: friendID }, { friend_ID: userID }, { followed_ID: null }] } });
            if (activityInstanceOne) {
                await activityInstanceOne.destroy();
            };
            if (activityInstanceTwo) {
                await activityInstanceTwo.destroy();
            };
            return res.status(200).json(deleteFriend.friend_ID);
        } else {
            const deleteFriend2 = await friend.findOne({ where: { [Op.and]: [{ user_ID: friendID }, { friend_ID: userID }] } });
            if (deleteFriend2) {
                await deleteFriend2.destroy();
                const activityInstanceOne = await activity.findOne({ where: { [Op.and]: [{ user_ID: userID }, { friend_ID: friendID }, { followed_ID: null }] } });
                const activityInstanceTwo = await activity.findOne({ where: { [Op.and]: [{ user_ID: friendID }, { friend_ID: userID }, { followed_ID: null }] } });
                if (activityInstanceOne) {
                    await activityInstanceOne.destroy();
                };
                if (activityInstanceTwo) {
                    await activityInstanceTwo.destroy();
                };
                return res.status(200).json(deleteFriend2.user_ID);
            } else {
                return res.status(400).json({ error: `user has no friend with id of ${friendID}` });
            };

        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getFriends = async (req, res, next) => {
    const userID = req.params.userID;
    try {
        const friendListPre = await friend.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]:
                            [
                                { user_ID: userID },
                                { friend_ID: userID }
                            ]
                    },
                    { pending: false }
                ]
            },
            attributes: { exclude: ['pending'] },
        });
        const friendIDs = [];

        friendListPre.forEach(element => {
            if (element.user_ID != userID) {
                friendIDs.push(element.user_ID);
            };
            if (element.friend_ID != userID) {
                friendIDs.push(element.friend_ID);;
            };
        });

        if (friendIDs.length != 0) {
            const friendList = await user.findAll({
                where: { ID: { [Op.in]: friendIDs } },
                attributes: ['ID'],
                include:
                    [
                        { model: profile, attributes: ['alias'] }
                    ]
            });

            const result = [];
            friendList.forEach(element => {
                friendListPre.forEach(secondElement => {
                    if (element.ID == secondElement.user_ID) {
                        result.push({ ID: element.ID, profile: { alias: element.profile.alias }, date: secondElement.date });
                    };
                    if (element.ID == secondElement.friend_ID) {
                        result.push({ ID: element.ID, profile: { alias: element.profile.alias }, date: secondElement.date });
                    };
                });
            });
            return res.status(200).json(result);
        } else {
            return res.status(200).json([]);
        };

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};