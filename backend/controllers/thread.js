const { request } = require("../app");

const thread = require("../models").thread;
const comment = require("../models").comment;

exports.getThread = async (req, res, next) => {

    const threadID = req.params.ID;

    try {
        const data = await thread.findOne({ where: { ID: threadID }, include: { model: comment } })
        res.status(200)
            .json(data);
    }
    catch
    (error) {
        console.log(error);
        res.status(502);
    }
};


exports.CreateThread = async (req, res, next) => {

    const parentID = req.params.ID;
    const parentType = req.params.parent_type;
    const threadName = req.body.thread_name;
    const threadDate = req.body.date;
    const userID = req.body.user_id;

    try {
        const Thread = await thread.build({
            name: threadName,
            date: threadDate,
            user: userID,
        });
        await Thread.save();
        res.status(200)
            .json(Thread);
    } catch
    (error) {
        console.log(error);
        res.status(502);
    }
};

exports.editThread = async (req, res, next) => {

    const threadID = req.params.ID;
    const threadName = req.body.thread_name;
    const threadLocked = req.body.thread_locked;

    try {
        const Thread = await thread.findOne(threadID);
        Thread.set({
            name: threadName,
            locked: threadLocked
        });
        res.status(200)
            .json(Thread);
    } catch (error) {
        console.log(error);
        res.status(502);
    }
};

exports.deleteTread = async (req, res, next) => {

    const threadID = req.params.ID;

    try {
        const Thread = await thread.findOne(threadID);
        await Thread.destory();
        res.send(200)
            .json(Thread.ID);
    } catch (error) {
        console.log(error);
        res.status(502);
    }
};