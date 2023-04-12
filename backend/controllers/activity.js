const activity = require("../models").activity;
const comment = require('../models').comment;
const user = require('../models').user;
const thread = require('../models').thread;
const followed = require("../models").followed;
const friend = require("../models").friends;
const media = require("../models").media;
const carousel = require('../models').carousel;
const profile = require("../models").profile;
const media_reactions = require("../models").media_reactionlist;
const thread_reactions = require("../models").thread_reactionlist;
const comment_reactions = require("../models").comment_reactionlist;
const profile_reactions = require("../models").profile_reactionlist;
const carousel_reactions = require("../models").carousel_reactionlist;

exports.getActivity = async (req, res, next) => {
    const userID = req.user.ID;
    try {
        // TODO: biiig sql query to get every associated users doing, needs to be smhw ordered by date fields...
        // FIXME: smh most of reactionlists dont work here, figure out why...
        // FIXME: sql query returns over 1k rows in client but naught here...
        const activityFeed = await activity.findAll({
            where:
                { user_ID: userID },
            attributes: [['user_ID', 'ID']],
            include: [
                {
                    model: friend,
                    include: [
                        {
                            model: user,
                            as: "friendship_starter",
                            attributes: ['ID'],
                            // include: [
                            //     { model: profile, attributes: ["alias"] },
                            //     { model: media, attributes: ['ID'], order: ["last_edit"] },
                            //     { model: comment, attributes: ['ID'], order: ["last_edit"] },
                            //     { model: thread, attributes: ['ID'], order: ["created"] },
                            //     { model: carousel, attributes: ['ID'], order: ["modified_date"] },
                            //     { model: profile_reactions, order: ["date"] },
                            //{ model: thread_reactions, order: ["date"] },
                            //{ model: comment_reactions, order: ["date"] },
                            //{ model: media_reactions, order: ["date"] },
                            //{ model: carousel_reactions, order: ["date"] }
                            // ]
                        }]
                },
                {
                    model: friend,
                    include: [
                        {
                            model: user,
                            as: "friendship_recepient",
                            attributes: ['ID'],
                            //             include: [
                            //                 { model: profile, attributes: ["alias"] },
                            //                 { model: media, attributes: ['ID'], order: ["last_edit"] },
                            //                 { model: comment, attributes: ['ID'], order: ["last_edit"] },
                            //                 { model: thread, attributes: ['ID'], order: ["created"] },
                            //                 { model: carousel, attributes: ['ID'], order: ["modified_date"] },
                            //                 { model: profile_reactions, order: ["date"] },
                            //{ model: thread_reactions, order: ["date"] },
                            //{ model: comment_reactions, order: ["date"] },
                            //{ model: media_reactions, order: ["date"] },
                            //{ model: carousel_reactions, order: ["date"] }
                            //             ]
                        }]
                },
                {
                    model: followed,
                    include: [
                        {
                            model: user,
                            attributes: ['ID'],
                            as: "followed",
                            include: [
                                { model: media, attributes: { exclude: ['user_ID', 'deletedAt', 'deleted'] } },
                                { model: comment, attributes: { exclude: ['deletedAt', 'user_ID', 'deleted'] } },
                                //                 { model: thread, order: ["created"] },
                                //                 { model: carousel, order: ["modified_date"] },
                                //                 { model: profile_reactions, order: ["date"] },
                                //                 { model: thread_reactions, order: ["date"] },
                                //                 { model: comment_reactions, order: ["date"] },
                                //                 { model: media_reactions, order: ["date"] },
                                //                 { model: carousel_reactions, order: ["date"] }
                            ]
                        }
                    ]
                }
            ]
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