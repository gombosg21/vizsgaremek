const activity = require("../models").activity;
const comment = require('../models').comment;
const user = require('../models').user;
const thread = require('../models').thread;
const followed = require("../models").followed;
const friend = require("../models").friends;
const media = require("../models").media;
const carousel = require('../models').carousel;
const media_reactions = require("../models").media_reactionlist;
const thread_reactions = require("../models").thread_reactionlist;
const comment_reactions = require("../models").comment_reactionlist;
const profile_reactions = require("../models").profile_reactionlist;
const carousel_reactions = require("../models").carousel_reactionlist;

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
                                { model: media, order: ["last_edit"] },
                                { model: comment, order: ["last_edit"] },
                                { model: thread, order: ["created"] },
                                { model: carousel, order: ["modified_date"] },
                                { model: profile_reactions, order: ["date"] },
                                { model: thread_reactions, order: ["date"] },
                                { model: comment_reactions, order: ["date"] },
                                { model: media_reactions, order: ["date"] },
                                { model: carousel_reactions, order: ["date"] }
                            ]
                        }]
                },
                {
                    model: followed,
                    include: [
                        {
                            model: user,
                            include: [
                                { model: media, order: ["last_edit"] },
                                { model: comment, order: ["last_edit"] },
                                { model: thread, order: ["created"] },
                                { model: carousel, order: ["modified_date"] },
                                { model: profile_reactions, order: ["date"] },
                                { model: thread_reactions, order: ["date"] },
                                { model: comment_reactions, order: ["date"] },
                                { model: media_reactions, order: ["date"] },
                                { model: carousel_reactions, order: ["date"] }
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