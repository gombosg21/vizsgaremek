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
        const Media = await media.findOne({
            where:
            {
                ID: mediaID,
            },
            attributes: ["ID", "file_data", "uploaded", "description", "placeholder_text", "visibility"],
            include: [
                {
                    model: user,
                    attributes: ["ID", "alias"]
                },
                {
                    model: tag,
                    attributes: ["ID", "name"]
                }]
        });

        var userID = -1;
        if (req.user) { userID = req.user.ID; };

        const itemVisibility = Media.visibility;
        const mediaOwner = Media.user.ID;

        const results = await Visibility(userID, mediaOwner, itemVisibility, Media.dataValues);

        return res.status(results.status).json(results.data);
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getAllMediaFromUser = async (req, res, next) => {
    const mediaOwner = Number(req.params.userID);

    try {
        const MediaList = await media.findAll({
            where: {
                user_ID: mediaOwner,
            },
            attributes: ["ID", "file_data", "uploaded", "description", "placeholder_text", "visibility"],
            include: [
                {
                    model: user,
                    attributes: ["ID", "alias"]
                },
                {
                    model: tag,
                    attributes: ["ID", "name"]
                }]
        });

        if (MediaList == null) { return res.status(200).json({ message: "user has no uploads" }); };

        var userID = -1;
        if (req.user) { userID = req.user.ID; };

        const visibilityFlagArray = [];
        const evalList = [];
        MediaList.forEach(Media => {
            evalList.push(Media.dataValues);
            visibilityFlagArray.push(Media.visibility);
        });

        const results = await VisibilityArray(userID, mediaOwner, visibilityFlagArray, evalList);
        return res.status(200).json({ results: results });

    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};


exports.getAllMediaByTags = async (req, res, next) => {
    const tagIDs = req.query.tagids;

    try {
        var userID = -1;
        if (req.user) { userID = req.user.ID; };

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

        const MediaList = await media.findAll(
            {
                where: {
                    ID: { [Op.in]: MediaIDList },
                },
                attributes: ["ID", "file_data", "uploaded", "description", "placeholder_text", "visibility"],
                include: [
                    {
                        model: user,
                        attributes: ["alias", "ID"]
                    },
                    {
                        model: tag,
                        attributes: ["ID", "name"]
                    }],
            });

        const visibilityFlagArray = [];
        const dataOwnerIDArray = [];
        const evalList = [];
        MediaList.forEach(Media => {
            evalList.push(Media.dataValues);
            visibilityFlagArray.push(Media.visibility);
            dataOwnerIDArray.push(Media.user.ID);
        });

        const results = await determineMixedArrayVisibility(userID, dataOwnerIDArray, visibilityFlagArray, evalList);
        return res.status(200).json({ results: results });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};


exports.uploadMedia = async (req, res, next) => {

    const userID = req.user.ID
    const data = req.file.buffer;
    const description = req.body.description;
    const visibility = req.body.visibility;
    const placeholder_text = req.body.placeholder_text;
    const tagArray = req.body.tag_id_array;

    try {
        const upload = await media.create({
            user_ID: userID,
            file_data: await toBase64(data),
            description: description,
            visibility: visibility,
            placeholder_text: placeholder_text
        });

        if (tagArray) { await upload.setTags(tagArray); };

        return res.status(200).json({ ID: upload.ID });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.deleteMedia = async (req, res, next) => {
    const ID = req.params.mediaID;

    try {
        const Media = await media.findByPk(ID);

        await Media.destroy();

        return res.status(200).json(Media.ID);
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.editMedia = async (req, res, next) => {
    const ID = req.params.mediaID;

    try {
        const Media = await media.findByPk(ID);

        Media.update({
            description: req.body.description ?? Media.description,
            visibility: req.body.visibility ?? Media.visibility,
            placeholder_text: req.body.placeholder_text ?? Media.placeholder_text
        });

        await Media.save();
        return res.status(200).json(Media);
    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.editMediaTags = async (req, res, next) => {
    const ID = req.params.mediaID;
    const tagIDListAdd = req.body.tag_id_list_add;
    const tagIDListRemove = req.body.tag_id_list_remove;

    try {
        const Media = await media.findOne({
            where:
                { ID: ID },
            include: [{
                model: tag,
                attributes: ["ID", "name"]
            }]
        });

        if (tagIDListAdd) {
            await Media.addTags(tagIDListAdd);
        };
        if (tagIDListRemove) {
            // instance.removeBars is a function according to docs, but not to ORM...
            await Media.removeTag(tagIDListRemove);
        };
        await Media.save();


        const tagListRaw = await media.findOne({
            where:
                { ID: ID },
            include: [{
                model: tag,
                attributes: ["ID", "name"]
            }]
        });

        const tagList = tagListRaw.tags;

        return res.status(200).json({ new_taglist: tagList });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};
