const media = require("../models").media;
const tag = require("../models").tag;
const media_taglist = require("../models").media_taglist;
const user = require("../models").user;
const { Op, fn } = require("sequelize");
const { determineMixedArrayVisibility } = require("../helpers/authorization/visibility");
const Visibility = require('../helpers/authorization/visibility').determineVisibility;
const VisibilityArray = require('../helpers/authorization/visibility').determineArrayVisibility;
const toBase64 = require("../util/serialize-file").getBase64;

exports.getMediaByID = async (req, res, next) => {
    const mediaID = req.params.mediaID;

    try {
        const Media = await media.findOne({ where: { ID: mediaID }, include: [{ model: user, attributes: ["name"] }, { model: tag, attributes: ["name"] }] });

        var userID = -1;
        if (req.user) { userID = req.user.ID; };

        const mediaTagList = [];
        Media.tags.forEach(tag => { mediaTagList.push({ "name": tag.name }) });
        const MediaData = {
            ID: Media.ID,
            uploader: Media.user.name,
            file: Media.file_data,
            uploaded: Media.uploaded,
            description: Media.description,
            placeholder_text: Media.placeholder_text,
            tags: mediaTagList
        };

        const itemVisibility = Media.visibility;
        const mediaOwner = Media.user_ID;

        results = await Visibility(userID, mediaOwner, itemVisibility, MediaData);

        return res.status(results.status).json(results.data);
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
};

exports.getAllMediaFromUser = async (req, res, next) => {
    const mediaOwner = Number(req.params.userID);

    try {
        const MediaList = await media.findAll({ where: { user_ID: mediaOwner }, include: [{ model: user, attributes: ["name"] }, { model: tag, attributes: ["name"] }] });
        if (MediaList == null) {
            return res.status(200).json({ "msg": "user has no uploads" });
        } else {
            var userID = -1;
            if (req.user) { userID = req.user.ID; };

            const MediaDataList = [];
            const visibilityFlagArray = [];

            MediaList.forEach(Media => {
                const mediaTagList = [];
                Media.tags.forEach(tag => { mediaTagList.push({ "name": tag.name }) });
                var MediaData = {
                    ID: Media.ID,
                    uploader: Media.user.name,
                    file: Media.file_data,
                    uploaded: Media.uploaded,
                    description: Media.description,
                    placeholder_text: Media.placeholder_text,
                    tags: mediaTagList
                };
                MediaDataList.push(MediaData);
                visibilityFlagArray.push(Media.visibility);
            });

            const result = await VisibilityArray(userID, mediaOwner, visibilityFlagArray, MediaDataList);

            if (result[0] != undefined) {
                return res.status(200).json(result);
            } else {
                return res.status(403).json({ "error": "insufficient privilegdes" });
            };
        };
    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};


exports.getAllMediaByTags = async (req, res, next) => {
    const tagIDs = req.query.tagids;

    try {
        var userID = -1;
        if (req.user) { userID = req.user.ID; };

        var MediaList = []
        var MediaAssocList = [];
        if (tagIDs.length > 1) {

            MediaAssocList = await media_taglist.findAll({
                where: { tag_ID: { [Op.in]: tagIDs } },
                attributes: { include: [[fn('COUNT', 'tag_ID'), 'tagIDs']] },
                group: ['media_ID'],
                having: { tagIDs: { [Op.gte]: tagIDs.length } }
            });

        } else {
            const tagID = tagIDs
            MediaAssocList = await media_taglist.findAll({ where: { tag_ID: tagID } });
        };

        const MediaIDList = [];
        MediaAssocList.forEach(media => {
            MediaIDList.push(media.media_ID);
        });

        console.log(MediaIDList)

        MediaList = await media.findAll({ where: { ID: { [Op.in]: MediaIDList } }, include: [{ model: user, attributes: ["name", "ID"] }, { model: tag, attributes: ["name"] }] });

        if (MediaList == null || undefined || MediaList.lenght == 0) {
            return res.status(200).json({ "msg": "no matches found" });
        } else {

            const MediaDataList = [];
            const visibilityFlagArray = [];
            const dataOwnerIDArray = [];

            MediaList.forEach(Media => {
                const mediaTagList = [];
                Media.tags.forEach(tag => { mediaTagList.push({ "name": tag.name }) });
                var MediaData = {
                    ID: Media.ID,
                    uploader: Media.user.name,
                    file: Media.file_data,
                    uploaded: Media.uploaded,
                    description: Media.description,
                    placeholder_text: Media.placeholder_text,
                    tags: mediaTagList
                };
                MediaDataList.push(MediaData);
                visibilityFlagArray.push(Media.visibility);
                dataOwnerIDArray.push(Media.user.ID);
            });

            const result = await determineMixedArrayVisibility(userID, dataOwnerIDArray, visibilityFlagArray, MediaDataList);
            return res.status(200).json(result);
        };
    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};


exports.uploadMedia = async (req, res, next) => {

    const userID = req.user.ID
    const data = req.file.buffer;
    const description = req.body.description;
    const visibility = req.body.visibility;
    const placeholder_text = req.body.placeholder_text;
    const tags = req.body.tags;

    try {
        const upload = await media.create(
            {
                user_ID: userID,
                file_data: await toBase64(data),
                description: description,
                visibility: visibility,
                placeholder_text: placeholder_text
            });

        if (tags) {
            tagArray = tags.split(",")

            await upload.setTags(tagArray);
        };

        res.status(200)
            .json(upload.ID);

    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.deleteMedia = async (req, res, next) => {
    const ID = req.params.mediaID;

    try {
        const Media = await media.findByPk(ID);

        Media.set({
            deleted: true
        });
        await Media.save();
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
    const ID = req.params.mediaID;

    try {
        const Media = await media.findOne({ where: { id: ID } });

        Media.set({
            description: req.body.description,
            visibility: req.body.visibility,
            placeholder_text: req.body.placeholder_text
        });

        await Media.save();
        res.status(200)
            .json(Media);
    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.editMediaTags = async (req, res, next) => {
    const ID = req.params.mediaID;
    const tagIDList = req.body.tagidlist;

    console.log(tagIDList)

    try {
        const Media = await media.findOne({ where: { id: ID }, include: [{ model: tag, attributes: ["ID"] }] });
        await Media.setTags(tagIDList);
        const updatedMedia = await media.findOne({ where: { id: ID }, include: [{ model: tag, attributes: ["ID"] }] });

        const tagList = updatedMedia.tags;
        const returnList = [];

        for (var Tag of tagList) { returnList.push(Tag.ID) };

        res.status(200)
            .json(returnList);
    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};

