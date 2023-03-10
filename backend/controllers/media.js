const media = require("../models").media;
const tag = require("../models").tag;
const media_taglist = require("../models").media_taglist;
const { Op } = require("sequelize");
const Visibility = require('../middlewares/authentiaction/visibility').determineVisibility;
const VisibilityArray = require('../middlewares/authentiaction/visibility').determineArrayVisibility;

exports.getMediaByID = async (req, res, next) => {
    const mediaID = req.params.media_ID;

    try {
        const Media = await media.findOne({ where: { ID: mediaID }, include: { model: tag, model: user } });

        if (Media == null) {
            return res.status(404).json({ "error": "file is gone or never was" })
        } else {
            const MediaData = {
                uploader: user.name,
                file: Media.file,
                uploaded: Media.uploaded,
                description: Media.description,
                placeholder_text: Media.placeholder_text
            };

            const itemVisibility = Media.visibility;
            const mediaOwner = Media.User_ID;
            var userID = -1;
            if (req.user) {
                userID = req.user.ID;
            };

            let results = {};

            results = Visibility(userID, mediaOwner, itemVisibility, MediaData);

            res.status(results.status)
                .json(results.data);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
};

exports.getAllMediaFromUser = async (req, res, next) => {
    const mediaOwner = req.params.user_ID;

    try {
        const MediaList = await media.findAll({ where: { user_ID: mediaOwner }, include: { model: tag } });
        if (MediaList == null) {
            return res.status(404).json({ "error": "file is gone or never was" });
        } else {
            var userID = -1;
            if (req.user) {
                userID = req.user.ID;
            };

            var VisibilityArray = [];
            MediaList.forEach(Media => {
                VisibilityArray.push(Media.visibility);
            });

            var MediaDataList = [];

            MediaDataList = determineArrayVisibility(userID, mediaOwner, VisibilityArray, MediaList);

            if (MediaDataList[0] != undefined) {
                res.status(200)
                    .json(MediaDataList);
            } else {
                res.status(403)
                    .json({ "error": "insufficient privilegdes" })
            };
        };
    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};

preProcessAndSequence = (propArray,AndKey) => {
    const preProcessedAndSequence = [];
    if (propArray.isArray() == false) {
        throw new Error("propArray must be an array");
    };
    if (propArray.length == 0) {
        throw new Error("propArray cannot be empty");
    };
    if(AndKey == undefined || null) {
        throw new Error("argument AndKey missing");
    };
    if (typeof AndKey != "string") {
        throw new Error("AndKey must be a string");
    };
    for(let i=0; i< propArray.length; i++) {
        preProcessedAndSequence.push({[AndKey]:propArray[i]});
    };
    return preProcessedAndSequence;
};

exports.getAllMediaByTags = async (req, res, next) => {

    const tagNames = req.query.tags;

    const tagIDs = [];

    tagNames.forEach(async Tag => {
        var TagID = await tag.findOne({ where: { name: Tag }, attributes: ['ID'] });
        if (TagID != null) {
            tagIDs.push(Tag);
        };
    });

    const tagIdAndArray = preProcessAndSequence(tagIDs,"tag_ID");

    try {
        const MediaIDList = await media_taglist.findAll({ where: {[Op.and]:tagIdAndArray},attributes:['media_ID']});

        const MediaDataList = await media.findAll({where:{ID: {[Op.in]:MediaIDList}}});

        MediaDataList.forEach(Media => {
            var itemVisibility = Media.visibility;
            var MediaData = {
                uploader: user.name,
                file: Media.file,
                uploaded: Media.uploaded,
                description: Media.description,
                placeholder_text: Media.placeholder_text
            };
            let results = {};
            var userID = -1;
            if (req.user) {
                userID = req.user.ID;
            };

            results = Visibility(userID, mediaOwner, itemVisibility, MediaData);

            if (results.status == 200) {
                MediaDataList.push(MediaData);
            };
        });
        if (MediaDataList[0] != undefined) {
            res.status(200)
                .json(MediaDataList);
        } else {
            res.status(403)
                .json({ "error": "insufficient privilegdes" })
        };
    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};


exports.uploadMedia = async (req, res, next) => {

    const userID = req.user.ID
    const data = req.files;
    const description = req.body.description;
    const visibility = req.body.visibility;
    const placeholder_text = req.body.placeholder_text;
    const tags = req.body.tags;

    try {
        const Media = media.build(
            {
                user_ID: userID,
                data: data,
                description: description,
                visibility: visibility,
                placeholder_text: placeholder_text,
                tags: {
                    name: tags
                }, include: [{
                    association: media_taglist.media_ID,
                }]
            });
        await Media.save();
        res.status(200);

    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};

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
        res.status(500);
    };
};

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
        res.status(500);
    };
};
