const user = require("../models").user;
const friend = require("../models").friend;
const followed = require("../models").followed;
const activity = require("../models").activity;

exports.getActivity = async (req, res, next) => {
    const userID = req.user.ID;
    try {
        const activityFeed = activity.findAll({ where: { user_ID: userID } });

        // biiig sql query to get every associated users doing, too tired to do it now
    } catch (error) {
        console.log(error);
        return res.status(500);
    };
};

exports.notify = async (req, res, next) => {
    const userID = req.user.ID;
    try {
        // learn how push notifications work...
    } catch (error) {
        console.log(error);
        return res.status(500);
    };
};