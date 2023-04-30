const carousel = require('../models').carousel;
const carousel_medialist = require('../models').carousel_medialist;
const carousel_reactionlist = require('../models').carousel_reactionlist;
const user = require('../models').user;
const tag = require('../models').tag;
const media = require('../models').media;
const profile = require('../models').profile;
const thread = require('../models').thread;
const visibility = require('../helpers/authorization/visibility');
const { Op, fn } = require("sequelize");

exports.createStory = async (req, res, next) => {
    const userID = req.user.ID;
    const name = req.body.name;
    var visibility = req.body.visibility;
    const description = req.body.description;
    const medias = req.body.medias;

    try {
        const userUpLoadIDList = (await media.findAll({ where: { user_ID: userID }, attributes: ['ID'] })).map(Media => Media.ID);

        const carousel_medias = [];
        const badIDList = [];
        medias.forEach(Media => {
            if (userUpLoadIDList.includes(Media.ID)) {
                carousel_medias.push({
                    media_ID: Media.ID,
                    carousel_ID: newStory.ID,
                    item_number: Media.item_number,
                    item_description: Media.description
                });
            } else {
                badIDList.push(Media.ID)
            };
        });

        if (carousel_medias.length == 0) { return res.status(400).json({ error: "no valid media IDs where given" }) };

        const newStory = await carousel.create({
            user_ID: userID,
            name: name,
            visibility: visibility,
            description: description
        });

        await carousel_medialist.bulkCreate(carousel_medias);

        const result = {
            ID: newStory.ID
        };

        if (badIDList.length != 0) {
            result.bad_media_ids = badIDList;
        };

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getStory = async (req, res, next) => {
    const ID = req.params.storyID;

    try {
        const Story = await carousel.findByPk(ID,
            {
                include: [
                    {
                        model: user,
                        attributes: ['ID'],
                        include: [{
                            model: profile,
                            attributes: ['alias']
                        }]
                    },
                    {
                        model: media,
                        attributes: { exclude: ["deletedAt"] },
                        include: [
                            { model: tag, attributes: ["name", "ID"] }
                        ]
                    }, {
                        model: carousel_reactionlist, attributes: [['reaction_ID', 'ID'], [fn('COUNT', 'carousel_reactionlists.reaction_ID'), 'reaction_count']]
                    }, {
                        model: thread, attributes: ['ID', 'name', 'created', 'last_activity', 'status']
                    }],
                group: ['carousel_reactionlists.reaction_ID']
            });

        var userID = -1
        if (req.user) {
            userID = req.user.ID;
        };

        const visibilityFlag = Story.visibility;
        const dataOwnerID = Story.user.ID;

        //const storyMediaList = [];

        // Story.media.forEach(Media => {
        //     var mediaTagList = [];
        //     Media.tags.forEach(tag => { mediaTagList.push({ "name": tag.name }) });
        //     storyMediaList.push({
        //         ID: Media.ID,
        //         file: Media.file_data,
        //         uploaded: Media.uploaded,
        //         description: Media.description,
        //         placeholder_text: Media.placeholder_text,
        //         tags: mediaTagList
        //     });
        // });

        // const data = {
        //     ID: Story.ID,
        //     name: Story.name,
        //     description: Story.description,
        //     created: Story.created_date,
        //     updated: Story.modified_date,
        //     media_list: storyMediaList
        // };

        const result = await visibility.determineVisibility(userID, dataOwnerID, visibilityFlag, Story.dataValues);

        return res.status(result.status).json({ carousel: result.data });

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getAllStoryFromUser = async (req, res, next) => {
    const userID = Number(req.params.userID);
    try {
        const StoryList = await carousel.findAll({
            where: { user_ID: userID },
            attributes: { exclude: ["deleted", "deletedAt", "user_ID"] },
            include:
                [
                    {
                        model: carousel_medialist,
                        attributes: { exclude: ["carousel_ID", "media_ID"] },
                        include:
                            [
                                {
                                    model: media,
                                    attributes: ["ID", "file_data", "uploaded", "description", "placeholder_text", "visibility", "last_edit"],
                                    include:
                                        [
                                            {
                                                model: tag,
                                                attributes: ['ID', 'name']
                                            },
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

        if (StoryList.length == 0) {
            return res.status(200).json({ message: "user has no stories" });
        };

        const storyIDs = StoryList.map(Story => Story.dataValues.ID);

        const story_reactions = await carousel_reactionlist.findAll({
            where: { carousel_ID: { [Op.in]: storyIDs } },
            attributes: [['reaction_ID', 'ID',], 'carousel_ID', [fn('COUNT', 'reaction_ID'), 'count']],
            group: ['reaction_ID']
        });


        var userContextID = -1
        if (req.user) {
            userContextID = req.user.ID;
        };

        const dataArray = [];
        const visibilityArray = [];

        StoryList.forEach(story => {
            visibilityArray.push(story.visibility);
            dataArray.push(story.dataValues);
            story.dataValues.reactions = [];

            if (story_reactions.length != 0) {
                story_reactions.forEach(reactions => {
                    console.log(reactions)
                    if (story.dataValues.ID == reactions.dataValues.carousel_ID) {
                        story.dataValues.reactions.push({
                            ID: reactions.dataValues.ID,
                            count: reactions.dataValues.count
                        });
                    };
                });
            };
        });

        const resultArray = await visibility.determineArrayVisibility(userContextID, userID, visibilityArray, dataArray);

        return res.status(200).json(resultArray);

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.editStory = async (req, res, next) => {
    const ID = req.params.storyID;
    const name = req.body.name;
    var visibility = req.body.visibility;
    const description = req.body.description;
    const addMediaList = req.body.add_medias;
    const removeMediaList = req.body.remove_media_ids;
    const changeMediaList = req.body.change_medias;

    try {
        const Story = await carousel.findByPk(ID, { include: [{ model: media, attributes: ['ID', 'visibility'] }] });
        const userMediaIDList = await media.findAll({ where: { user_ID: ID }, attributes: ['ID', 'visibility'] });

        // const userMediaIDs = userMediaIDList.map(Media => Media.ID);
        const StoryItems = [];

        Story.media.map(Media => StoryItems.push({
            item_description: Media.carousel_medialist.item_description,
            media_ID: Media.carousel_medialist.media_ID,
            item_number: Media.carousel_medialist.item_number,
            carousel_ID: Story.ID
        }));

        // remove story elements by id
        const badRemoveIDs = [];
        if (removeMediaList) {
            removeMediaList.forEach(ID => {
                var found = false;
                for (let i = 0; i < StoryItems.length; i++) {
                    if (StoryItems[i].ID == ID) {
                        StoryItems.splice(i, 1);
                        found = true;
                        break;
                    };
                };
                if (!found) {
                    badRemoveIDs.push(ID);
                };
            });
        };

        // add changed items
        const badMediaIDs = [];
        if (changeMediaList) {
            changeMediaList.forEach(Media => {
                var found = false;
                for (let i = 0; i < StoryItems.length; i++) {
                    if (StoryItems[i].media_ID == ID) {
                        StoryItems.splice(i, 1);
                        StoryItems.push({
                            media_ID: Media.ID,
                            carousel_ID: Story.ID,
                            item_number: Media.item_number,
                            item_description: Media.description
                        });
                        found = true;
                        break;
                    };
                };
                if (!found) {
                    badMediaIDs.push(Media.ID);
                };
            });
        };

        // add story elements by id with props
        const badAddIDs = [];
        const filteredAddMedias = [];
        if (addMediaList) {
            addMediaList.forEach(Media => {
                var found = false;
                for (let i = 0; i < userMediaIDList.length; i++) {

                    if (userMediaIDList[i].ID == Media.ID) {
                        found = true;
                        filteredAddMedias.push({
                            media_ID: Media.ID,
                            carousel_ID: Story.ID,
                            item_number: Media.item_number,
                            item_description: Media.description
                        });
                        break;
                    };
                };
                if (!found) {
                    badAddIDs.push(Media.ID);
                };
            });
        };

        // sort by item_number
        StoryItems.sort((a, b) => ((a.item_number > b.item_number) ? 1 : ((b.item_number > a.item_number) ? -1 : 0)));


        //remove bad items
        const conflictItems = [];
        const filteredStoryItems = [];
        for (let i = 0; i < (StoryItems.length - 1); i++) {
            if (StoryItems[i].item_number != StoryItems[i + 1].item_number) {
                filteredStoryItems.push(StoryItems[i]);
            } else {
                conflictItems.push({ conflicts: [StoryItems[i], StoryItems[i + 1]] });
            };
        };

        // finalize transaction
        await Story.update({
            name: name ?? Story.name,
            visibility: visibility ?? Story.visibility,
            description: description ?? Story.description
        });

        await Story.setMedia(filteredStoryItems);
        await Story.save();

        const updatedStroy = await carousel.findByPk(ID, { include: [{ model: media }] });

        const result = { story: updatedStroy };

        if (badAddIDs.length != 0) {
            result.bad_add_ids = badAddIDs;
        };
        if (badRemoveIDs.length != 0) {
            result.bad_remove_ids = badRemoveIDs;
        };
        if (badMediaIDs.length != 0) {
            result.bad_modify_ids = badMediaIDs;
        };
        if (conflictItems.length != 0) {
            result.conflicting_items = conflictItems;
        };

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.searchStory = async (req, res, next) => {
    const date = new Date();
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const currDate = new Date(year, month, day).toJSON();


    const name = req.query.name;
    const description = req.query.description;
    const mediaIDs = req.query.media_ids;
    const userID = req.query.user_id;
    const createdStart = req.query.created_start ?? "1000-01-01";
    const createdEnd = req.query.created_end ?? currDate;
    const editStart = req.query.edit_start ?? "1000-01-01";
    const editEnd = req.query.edit_end ?? currDate;

    try {

        const query = {
            where: {
                [Op.and]: [
                    { created_date: { [Op.between]: [createdStart, createdEnd] } },
                    { modified_date: { [Op.between]: [editStart, editEnd] } }]
            },
            include: [{
                model: media, attributes: [],
                include: [{ model: tag, attributes: [] }]
            }], attributes: ['ID', 'name', 'created_date', 'modified_date']
        };

        if (name) {
            query.where[Op.and].push({ name: { [Op.substring]: name } });
        };
        if (description) {
            query.where[Op.and].push({ description: description });
            query.attributes.push('description');
        };
        if (mediaIDs) {
            query.include[0].where = { ID: { [Op.in]: [mediaIDs] } };
            query.include[0].attributes.push('ID');
        };
        if (userID) {
            query.where[Op.and].push({ user_ID: userID });
            query.include.push({ model: user, attributes: ['ID'], include: [{ model: profile, attributes: ['alias'] }] });
        };

        const results = await carousel.findAll(query);

        res.status(200).json({ results: results });

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.deleteStory = async (req, res, next) => {
    const ID = req.params.storyID;
    try {

        const Story = await carousel.delete({ where: { ID: ID } });

        return res.status(200).json({ ID: Story.ID });

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};