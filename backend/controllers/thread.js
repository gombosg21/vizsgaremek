const thread = require("../models").thread;
const comment = require("../models").comment;
const user = require("../models").user;
const media = require("../models").media;
// const story = require("../models").story;

exports.getThread = async (req, res, next) => {

    const threadID = req.params.ID;

    try {
        const data = await thread.findOne({ where: { ID: threadID }, include: [{ model: comment,attributes:['content','ID','created','last_edit'],include:[{model:user,attributes:['ID','name']}] }, { model: user, attributes: ['ID', 'name'] }] });
        res.status(200)
            .json(data);
    }
    catch
    (error) {
        console.error(error);
        res.status(500);
    };
};

exports.getAllThreads = async (req, res, next) => {

    try {
        const threadList = await thread.findAll({ attributes: ['ID', 'name', 'status', 'created', 'last_activity'], include: [{ model: user, attributes: ['ID', 'name'] }] });

        res.status(200).json(threadList);
    } catch (error) {
        console.error(error)
    };
};


exports.CreateThread = async (req, res, next) => {

    const parentID = req.params.ID;
    const parentType = req.params.parent_type;
    const threadName = req.body.name;
    const userID = req.user.ID;

    console.log(parentID)
    console.log(parentType)
    console.log(threadName)
    console.log(userID)

    try {
        switch (parentType) {
            case ("user"): {
                const targetUserID = await user.findOne({ where: { ID: parentID } }).ID;

                break
            }
            case ("media"): {
                const targetMediaID = await media.findOne({ where: { ID: parentID } }).ID;
                const Thread = await thread.create({
                    name: threadName,
                    user_ID: userID,
                    media_ID: parentID
                });
                res.status(200)
                    .json({ "ID": Thread.ID });
                break
            }
            // case ("story"): {
            //     const targetStoryID = await story.findOne({where:{ID:parentID}}).ID;
            //     break
            // }
            default: {
                res.status(500).json({ error: "server-side error" })
                break
            };
        };
    } catch
    (error) {
        console.error(error);
        res.status(500);
    };
};

exports.editThread = async (req, res, next) => {

    const threadID = req.params.ID;
    const threadName = req.body.name;
    const threadStatus = req.body.status;

    try {
        const Thread = await thread.findOne(threadID);
        Thread.set({
            name: threadName,
            status: threadStatus
        });
        res.status(200)
            .json(Thread);
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.deleteTread = async (req, res, next) => {

    const threadID = req.params.ID;

    try {
        const Thread = await thread.findOne(threadID);
        await Thread.destory();
        res.send(200)
            .json(Thread.ID);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
};