const user = require("../models").user;
const friend = require("../models").friend;
const followed = require("../models").followed;
const media = require("../models").media;
const comment = require("../models").comment;
const thread = require("../models").thread;
const carousel = require("../models").carousel;
const profile_reactions = require("../models").profile_reactionlist;
const comment_reactions = require("../models").comment_reactionlist;
const thread_reactions = require("../models").thread_reactionlist;
const media_reactions = require("../models").media_reactionlist;
const carousel_reactions = require("../models").carousel_reactionlist;
const activity = require("../models").activity;

exports.getActivity = async (req, res, next) => {
    const userID = req.user.ID;
    try {
        // biiig sql query to get every associated users doing, needs to be smhw ordered by date fields...
        const activityFeed = activity.findAll({
            where:
                { user_ID: userID },
            include: [
                {
                    model: friend,
                    include: [
                        {
                            model: user,
                            include: [
                                { model: media },
                                { model: comment },
                                { model: thread },
                                { model: carousel },
                                { model: profile_reactions },
                                { model: thread_reactions },
                                { model: comment_reactions },
                                { model: media_reactions },
                                { model: carousel_reactions }
                            ]
                        }]
                },
                {
                    model: followed,
                    include: [
                        {
                            model: user, 
                            include: [
                                { model: media },
                                { model: comment },
                                { model: thread },
                                { model: carousel },
                                { model: profile_reactions },
                                { model: thread_reactions },
                                { model: comment_reactions },
                                { model: media_reactions },
                                { model: carousel_reactions }
                            ]
                        }
                    ]
                }]
        });

        return res.status(200).json(activityFeed);

    } catch (error) {
        console.log(error);
        return res.status(500);
    };
};

exports.subNotify = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500);
    };
};

exports.unSubNotify = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500);
    };
};

exports.notify = async (req, res, next) => {
    try {
        // learn how push notifications work...
        // needs webSockets
        // message must be baked dynamically
        // consult with teammates on howto
    } catch (error) {
        console.log(error);
        return res.status(500);
    };
};