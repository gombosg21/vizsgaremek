const thread = require("../models").thread;
const comment = require("../models").comment;
const user = require("../models").user;
const media = require("../models").media;
const carousel = require("../models").carousel;
const profile = require("../models").profile;
const comment_reactionlist = require("../models").comment_reactionlist;
const thread_reactionlist = require("../models").thread_reactionlist;
const { Op, fn, col } = require("sequelize");
// const story = require("../models").story;

exports.getThread = async (req, res, next) => {
    const threadID = req.params.threadID;

    try {
        const threadData = await thread.findOne({
            where: { ID: threadID },
            attributes: ['media_ID', 'name', 'created', 'last_activity'],
            include: [
                {
                    model: comment,
                    attributes: ['content', 'ID', 'created', 'last_edit'],
                    include: [
                        {
                            model: user,
                            attributes: ['ID'],
                            include: [{ model: profile, attributes: ['alias'] }]
                        },
                        {
                            model: comment_reactionlist,
                            attributes: [['reaction_ID', 'ID'], [fn('COUNT', 'comment_reactionlist.reaction_ID'), 'reaction_count']]
                        }
                    ]
                },
                {
                    model: user,
                    attributes: ['ID'],
                    include: [{ model: profile, attributes: ['alias'] }]
                },
                {
                    model: thread_reactionlist,
                    attributes: [['reaction_ID', 'ID'], [fn('COUNT', 'thread_reactionlist.reaction_ID'), 'reaction_count']]
                }
            ],
            group: [col('thread_reactionlists.reaction_ID'), col('comments.comment_reactionlists.reaction_ID')]
        });

        return res.status(200).json({ thread: threadData });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getAllThreads = async (req, res, next) => {

    try {
        const threadList = await thread.findAll({
            attributes: ['ID', 'name', 'status', 'created', 'last_activity'],
            include: [{
                model: user,
                attributes: ['ID', 'alias']
            }]
        });

        return res.status(200).json(threadList);
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};


exports.CreateThread = async (req, res, next) => {

    const parentID = (req.params.userID || req.params.mediaID) ?? req.params.storyID;
    const parentType = req.params.parent_type;
    const threadName = req.body.name;
    const userID = req.user.ID;

    try {
        switch (parentType) {
            // not used
            // case ("profile"): {
            //     const Thread = await thread.create({
            //         name: threadName,
            //         user_ID: userID,
            //         profile_ID: parentID
            //     });
            //     return res.status(200)
            //         .json({ "ID": Thread.ID });
            // }
            case ("media"): {
                const Thread = await thread.create({
                    name: threadName,
                    user_ID: userID,
                    media_ID: parentID
                });
                return res.status(200)
                    .json({ "ID": Thread.ID });
            }
            case ("story"): {
                const Thread = await thread.create({
                    name: threadName,
                    user_ID: userID,
                    carousel_ID: parentID
                });
                return res.status(200)
                    .json({ "ID": Thread.ID });
            }
            default: {
                return res.status(500).json({ error: "server-side error" });
            };
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.editThread = async (req, res, next) => {

    const threadID = req.params.threadID;
    const threadName = req.body.name;

    try {
        const Thread = await thread.findByPk(threadID);
        if (Thread.profile_ID == null) {
            Thread.set({
                name: threadName,
            });
            return res.status(200)
                .json(Thread);
        } else {
            return res.status(400).json({ error: "cannot rename profile thread" });
        };

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.deleteTread = async (req, res, next) => {
    const threadID = req.params.threadID;

    try {
        const Thread = await thread.findByPk(threadID);
        await Thread.destory();
        return res.send(200)
            .json({ ID: Thread.ID });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.searchThreads = async (req, res, next) => {
    try {
        const date = new Date();
        const day = date.getDay();
        const month = date.getMonth();
        const year = date.getFullYear();
        const currDate = new Date(year, month, day).toJSON();

        const threadName = req.query.name;
        const createdStart = req.query.created_start ?? "1000-01-01";
        const createdEnd = req.query.created_end ?? currDate;
        const lastActivityStart = req.query.activity_start ?? "1000-01-01";
        const lastActivityEnd = req.query.activity_end ?? currDate;
        const createrID = req.query.creater_id;
        const parentType = req.query.parent;
        const threadContent = req.query.content;

        const query = {
            where:
            {
                [Op.and]: [{ created: { [Op.between]: [createdStart, createdEnd] } }, { last_activity: { [Op.between]: [lastActivityStart, lastActivityEnd] } }]
            },
            attributes: ['ID', 'name', 'status', 'created', 'last_activity'],
            include: []
        };

        if (threadName) {
            query.where[Op.and].push({ [Op.substring]: threadName })
        };

        if (createrID) {
            query.include.push({
                model: user,
                attributes: ['ID', 'alias']
            });
            query.where[Op.and].push({ user_ID: createrID });
        };
        if (threadContent) {
            query.include.push({ model: comment, where: { content: { [Op.substring]: threadContent } }, attributes: ['ID', 'content'] });
        };

        switch (parentType) {
            case ("profile"): {
                query.where[Op.and].push({ profile_ID: { [Op.not]: null } });
                query.include.push({ model: user, attributes: ['ID', 'alias'] });
                break;
            }
            case ("media"): {
                query.where[Op.and].push({ media_ID: { [Op.not]: null } });
                query.include.push({ model: media, attributes: ['ID', 'user_ID'] });
                break;
            }
            case ("story"): {
                query.where[Op.and].push({ carousel_ID: { [Op.not]: null } });
                query.include.push({ model: carousel, attributes: ['ID', 'user_ID'] });
                break;
            }
            case (undefined): {
                // any parent is also a valid type
                break;
            }
            default: {
                return res.status(400).json({ error: "bad search parent type" });
            }
        };

        const threadList = await thread.findAll(query);

        return res.status(200).json({ results: threadList });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};