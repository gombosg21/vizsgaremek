const media = require("../models").media;
const tag = require("../models").tag;
const taglist = require("../models").taglist;
const user = require("../models").user;

exports.viewOneMediaFromUser = async (req, res, next) => {
    const ownerID = req.params.user_ID;
    const mediaID = req.params.media_ID;

    try {
        const MediaData = await media.findOne({ where: { id: mediaID, user_ID: ownerID }, include: { model: tag } });

        res.status(200).json(MediaData);
    }
    catch (error) {
        console.error(error);
        res.status(502);
    }
};

exports.getAllMediaFromUser = async (req, res, next) => {
    const ownerID = req.params.user_ID;

    try {
        const MediaList = await media.findAll({ where: { user_ID: ownerID }, include: { model: tag } });

        res.status(200).json(MediaList);
    }
    catch (error) {
        console.error(error);
        res.status(502);
    }
};

exports.getMediaByTags = async (req, res, next) => {
    const tags = req.query.tags;

    try {
        const MediaList = await media.findAll({ where: { user_ID: ownerID }, include: { model: tag, thorough: { model: taglist }, include: [{ name: [tags] }] } });
    }
    catch (error) {
        console.error(error);
        res.status(502);
    }

}

exports.uploadMedia = async (req, res, next) => {

    try {
        const Media = media.build(
            {
                user_ID: req.params.user_ID,
                data: req.body.imgData,
                description: req.body.description,
                visibility: req.body.visibility,
                placeholder_text: req.body.placeholder_text,
                tags: req.body.tags
            });

        await Media.save();
        res.status(200);

    }
    catch (error) {
        console.error(error);
        res.status(502);
    }
}

exports.deleteMedia = async (req, res, next) => {
    const ID = req.params.media_ID;

    try {
        const Media = await media.findOne(ID);

        await Media.destroy();

        res.status(200)
            .json(Media.ID);
    }
    catch (error) {
        console.error(error);
        res.status(502);
    }
}

exports.editMedia = async (req, res, next) => {
    const ID = req.params.media_ID;

    try {
        const Media = await media.findOne({ where: { id: ID } });

        Media.set({
            description: req.body.description,
            visibility: req.body.visibility,
            placeholder_text: req.body.placeholder_text
        }
        );
        await Media.save();
        res.status(200)
            .json(Media);
    }
    catch (error) {
        console.error(error);
        res.status(502);
    }
}
