const media = require("../models").media;
const profile = require("../models").profile;
const tag = require("../models").tag;
const media_taglist = require("../models").media_taglist;
const media_reactionslist = require("../models").media_reactionlist;
const user = require("../models").user;
const thread = require("../models").thread;
const { Op, fn, col } = require("sequelize");
const { determineMixedArrayVisibility, determineVisibility, determineArrayVisibility } = require("../helpers/authorization/visibility");
const toBase64 = require("../util/serialize-file").getBase64;

exports.getMediaByID = async (req, res, next) => {
    const mediaID = req.params.mediaID;

    //TODO remove media_taglists from results

    try {
        const Media = await media.findOne({
            where:
            {
                ID: mediaID,
            },
            attributes: ["ID", "file_data", "uploaded", "description", "placeholder_text", "visibility", "last_edit"],
            include: [
                {
                    model: user,
                    attributes: ["ID"], include: [
                        {
                            model: profile,
                            attributes: ["alias"]
                        }]
                },
                {
                    model: tag,
                    attributes: ["ID", "name"]
                },
                {
                    model: thread,
                    attributes: ['ID', 'name', 'created', 'last_activity', 'status'],
                    include:
                        [
                            {
                                model: user,
                                attributes: ["ID"],
                                include:
                                    [
                                        {
                                            model: profile,
                                            attributes: ["alias"]
                                        }
                                    ]
                            }
                        ]
                }
            ],
        });

        const reactions = await media_reactionslist.findAll({
            where: { media_ID: Media.ID },
            attributes: [["reaction_ID", "ID"], "media_ID", [fn('COUNT', 'media_reactionslist.reaction_ID'), 'count']],
            group: [col("reaction_ID"), col("media_ID")]
        });

        Media.dataValues.reactions = reactions.dataValues;

        var userID = -1;
        if (req.user) { userID = req.user.ID; };

        const itemVisibility = Media.visibility;
        const mediaOwner = Media.user.ID;

        const results = await determineVisibility(userID, mediaOwner, itemVisibility, Media.dataValues);

        return res.status(results.status).json(results.data);
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getAllMediaFromUser = async (req, res, next) => {
    const mediaOwner = Number(req.params.userID);

    //TODO remove media_taglists from results

    try {
        const MediaList = await media.findAll({
            where: {
                user_ID: mediaOwner,
            },
            attributes: ["ID", "file_data", "uploaded", "description", "placeholder_text", "visibility", "last_edit"],
            include: [
                {
                    model: user,
                    attributes: ["ID"],
                    include: [
                        {
                            model: profile,
                            attributes: ["alias"]
                        }]
                },
                {
                    model: tag,
                    attributes: ["ID", "name"]
                },
                {
                    model: thread,
                    attributes: ['ID', 'name', 'created', 'last_activity', 'status'],
                    include:
                        [
                            {
                                model: user,
                                attributes: ["ID"],
                                include:
                                    [
                                        {
                                            model: profile,
                                            attributes: ["alias"]
                                        }
                                    ]
                            }
                        ]
                }
            ],
        });

        if (MediaList.length == 0) { return res.status(200).json({ message: "user has no uploads" }); };

        const mediaIDs = MediaList.map(Media => Media.ID);

        const reactionsPre = await media_reactionslist.findAll({
            where: { media_ID: { [Op.in]: mediaIDs } },
            attributes: [["reaction_ID", "ID"], "media_ID", [fn('COUNT', 'media_reactionslist.reaction_ID'), 'count']],
            group: [col("reaction_ID"), col("media_ID")]
        });

        if (reactionsPre.length != 0) {
            for (let i = 0; i < MediaList.length; i++) {
                MediaList[i].dataValues.reactions = [];
                for (let j = 0; j < reactionsPre.length; j++) {
                    if (MediaList[i].ID == reactionsPre[j].media_ID) {
                        MediaList[i].dataValues.reactions.push({
                            count: reactionsPre[j].dataValues.count,
                            ID: reactionsPre[j].dataValues.ID
                        });

                    };
                };
            };
        };

        var userID = -1;
        if (req.user) { userID = req.user.ID; };

        const visibilityFlagArray = [];
        const evalList = [];
        MediaList.forEach(Media => {
            evalList.push(Media.dataValues);
            visibilityFlagArray.push(Media.visibility);
        });

        const results = await determineArrayVisibility(userID, mediaOwner, visibilityFlagArray, evalList);
        return res.status(200).json(results);

    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};


exports.getAllMediaByTags = async (req, res, next) => {
    var tagIDs = req.query.tagids;

    //TODO remove media_taglists from results

    try {
        if (!(tagIDs instanceof Array)) {
            tagIDs = [Number(tagIDs)];
        };

        if (tagIDs instanceof Array) {
            tagIDs = tagIDs.map(ID => Number(ID));
        };

        tagIDs.forEach(ID => {
            if (ID == NaN) {
                return res.status(400).json({ error: "invalid tag ID" });
            };
        });

        const validIDs = (await tag.findAll({ attributes: ['ID'] })).map(Tag => Tag.ID);
        const filteredIDList = [];
        const badIDList = [];
        tagIDs.forEach(ID => {
            if (validIDs.includes(ID)) {
                filteredIDList.push(ID);
            } else {
                badIDList.push(ID);
            };
        });

        if (filteredIDList.length == 0) {
            return res.status(400).json({ error: "no valid tag IDs given" })
        };

        var userID = -1;
        if (req.user) { userID = req.user.ID; };

        var MediaAssocList = [];

        MediaAssocList = await media_taglist.findAll({
            where: { tag_ID: { [Op.in]: filteredIDList } },
            attributes: { include: [[fn('COUNT', 'tag_ID'), 'tag_ID_list']] },
            group: ['media_ID'],
            having: { tag_ID_list: { [Op.gte]: filteredIDList.length } }
        });

        const MediaIDList = MediaAssocList.map(Media => Media.media_ID);

        const MediaList = await media.findAll(
            {
                where: {
                    ID: { [Op.in]: MediaIDList },
                },
                attributes: ["ID", "file_data", "uploaded", "description", "placeholder_text", "visibility"],
                include: [
                    {
                        model: user,
                        attributes: ["ID"],
                        include:
                            [
                                {
                                    model: profile,
                                    attributes: ['alias']
                                }
                            ]
                    },
                    {
                        model: tag,
                        attributes: ["ID", "name"]
                    },
                    {
                        model: thread,
                        attributes: ['ID', 'name', 'created', 'last_activity', 'status'],
                        include:
                            [
                                {
                                    model: user,
                                    attributes: ["ID"],
                                    include:
                                        [
                                            {
                                                model: profile,
                                                attributes: ["alias"]
                                            }
                                        ]
                                }
                            ]
                    }
                ]
            });

        if (MediaList.length == 0) {
            return res.status(200).json({ message: "no hits found" });
        };

        const reactionsPre = await media_reactionslist.findAll({
            where: { media_ID: { [Op.in]: [MediaIDList] } },
            attributes: [["reaction_ID", "ID"], "media_ID", [fn('COUNT', 'media_reactionslist.reaction_ID'), 'count']],
            group: [col("reaction_ID"), col("media_ID")]
        });

        if (reactionsPre.length != 0) {
            for (let i = 0; i < MediaList.length; i++) {
                MediaList[i].dataValues.reactions = [];
                for (let j = 0; j < reactionsPre.length; j++) {
                    if (MediaList[i].ID == reactionsPre[j].media_ID) {
                        var reactionObj = {
                            count: reactionsPre[j].dataValues.count,
                            ID: reactionsPre[j].dataValues.ID
                        }
                        MediaList[i].dataValues.reactions.push(reactionObj);
                    };
                };
            };
        };

        const visibilityFlagArray = [];
        const dataOwnerIDArray = [];
        const evalList = [];
        MediaList.forEach(Media => {
            evalList.push(Media.dataValues);
            visibilityFlagArray.push(Media.visibility);
            dataOwnerIDArray.push(Media.user.ID);
        });

        const results = await determineMixedArrayVisibility(userID, dataOwnerIDArray, visibilityFlagArray, evalList);

        if (badIDList.length != 0) {
            results.bad_tag_ids = badIDList;
        };

        return res.status(200).json(results);
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};


exports.uploadMedia = async (req, res, next) => {

    if (!req.file) {
        return res.status(400).json({ error: "no file data vas given" });
    };

    const userID = req.user.ID
    const data = req.file.buffer;
    const description = req.body.description;
    const visibility = req.body.visibility;
    const placeholder_text = req.body.placeholder_text;
    var tagArray = req.body.tag_id_array;

    try {

        if (!(tagArray instanceof Array)) {
            tagArray = [tagArray];
        };

        tagArray = tagArray.map(ID => Number(ID));

        const tagIDs = (await tag.findAll({ attributes: ['ID'] })).map(Tag => Tag.ID);


        const badIDArray = [];
        const filteredIDArray = [];
        tagArray.forEach(ID => {
            if (tagIDs.includes(ID)) {
                filteredIDArray.push(ID);
            } else {
                badIDArray.push(ID);
            };
        });

        if (filteredIDArray.length == 0) {
            return res.status(400).json({ error: "no valid tags given, aborting", bad_ids: badIDArray });
        };

        const upload = await media.create({
            user_ID: userID,
            file_data: await toBase64(data),
            description: description,
            visibility: visibility,
            placeholder_text: placeholder_text
        });

        await upload.setTags(filteredIDArray);

        const result = {
            ID: upload.ID
        };
        if (badIDArray.length != 0) {
            result.rejected_ids = badIDArray;
        };

        return res.status(200).json(result);
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
        const Media = await media.findByPk(ID, { attributes: { exclude: ['deletedAt'] } });

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


        const mediaTagIDs = Media.tags.map(Tag => Tag.ID);
        const tagIDs = (await tag.findAll({ attributes: ['ID'] })).map(Tag => Tag.ID);

        const filteredAddList = [];
        const badAddIDList = [];
        if (tagIDListAdd) {
            tagIDListAdd.forEach(ID => {
                if (tagIDs.includes(ID)) {
                    filteredAddList.push(ID);
                } else {
                    badAddIDList.push(ID);
                };
            });
        };

        if (filteredAddList.length != 0) {
            await Media.addTags(filteredAddList);
        };

        const badRemoveIDList = [];
        const filteredRemoveList = [];
        if (tagIDListRemove) {
            tagIDListRemove.forEach(ID => {
                if (mediaTagIDs.includes(ID)) {
                    filteredRemoveList.push(ID);
                } else {
                    badRemoveIDList.push(ID);
                };
            });
        };

        if (filteredRemoveList.length == mediaTagIDs.length) {
            return res.status(400).json({ error: "cannot remove ALL tags from media file, aborting" });
        };

        if (filteredRemoveList.length != 0) {
            // instance.removeBars is a function according to docs, but not to ORM...
            await Media.removeTag(tagIDListRemove);
        };

        if (filteredAddList.length == 0 && filteredRemoveList.length == 0) {
            return res.status(400).json({
                error: "only bad tag ids where given",
                bad_remove_ids: badRemoveIDList,
                bad_add_ids: badAddIDList
            })
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
        const result = {
            new_taglist: tagList
        };
        if (badAddIDList.length != 0) {
            result.bad_add_ids = badAddIDList;
        };
        if (badRemoveIDList.length != 0) {
            result.bad_remove_ids = badRemoveIDList;
        };

        return res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};
