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
        const dataOwnerID = Story.ID;

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
            include: [
                {
                    model: media, include: [
                        { model: tag, attributes: ['ID', 'name'] }
                    ]
                }, {
                    model: carousel_reactionlist, attributes: [['reaction_ID', 'ID'], [fn('COUNT', 'carousel_reactionlists.reaction_ID'), 'reaction_count']]
                }, {
                    model: thread, attributes: ['ID', 'name', 'created', 'last_activity', 'status']
                }],
            group: ['carousel_reactionlists.reaction_ID']
        });

        var userContextID = -1
        if (req.user) {
            userContextID = req.user.ID;
        };

        const dataArray = [];
        const visibilityArray = [];

        StoryList.forEach(story => {
            visibilityArray.push(story.visibility);
        });

        StoryList.forEach(story => {
            var storyMediaList = [];
            story.media.forEach(Media => {
                var mediaTagList = [];
                Media.tags.forEach(tag => { mediaTagList.push({ "name": tag.name }) });
                storyMediaList.push({
                    ID: Media.ID,
                    file: Media.file_data,
                    uploaded: Media.uploaded,
                    description: Media.description,
                    placeholder_text: Media.placeholder_text,
                    tags: mediaTagList
                });
            });
            var storyItem = {
                ID: story.ID,
                name: story.name,
                description: story.description,
                created: story.created_date,
                updated: story.modified_date,
                media_list: storyMediaList
            };
            dataArray.push(storyItem);
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
        const StoryItemNumbers = [];
        Story.map(Media => StoryItemNumbers.push({ ID: Media.carousel_medialist.media_ID, item_number: Media.carousel_medialist.item_number }));


        // remove story elements by id
        const filteredRemoveIDs = [];
        const badRemoveIDs = [];
        if (removeMediaList) {
            removeMediaList.forEach(ID => {
                for (let i = 0; i < StoryItemNumbers.length; i++) {
                    if (StoryItemNumbers[i].ID == ID) {
                        StoryItemNumbers.splice(i, 1);
                        filteredRemoveIDs.push(ID);
                    };
                };
                if (!(removeMediaList.includes(ID))) {
                    badRemoveIDs.push(ID);
                };
            });
            if (filteredRemoveIDs.length != 0) {
                await Story.removeMedia(filteredRemoveIDs);
            };
        };

        // change story elements by id with props
        const filteredMedias = [];
        const badMediaIDs = [];
        if (changeMediaList) {
            changeMediaList.forEach(Media => {
                for (let i = 0; i < StoryItemNumbers.length; i++) {
                    if (StoryItemNumbers[i].ID == ID) {
                        filteredMedias.push(Media);
                    };
                };
                if (!(filteredMedias.includes(Media))) { badMediaIDs.push(Media.ID) };
            });

            const changeItems = [];
            filteredMedias.forEach(Media => {
                // somehow remap array of objects to still contain unique objects...
                // if item x number changes to y and number y exsist eslewhere, check if its item also changes number, until number is a new number or chain ends, latter triggers a rejection
                changeItems.push({
                    media_ID: Media.ID,
                    carousel_ID: Story.ID,
                    item_number: Media.item_number,
                    item_description: Media.description
                });
            });
        };

        // add story elements by id with props
        // needs rework...
        const badAddIDs = [];
        const filteredAddMedias = [];
        const badItemNumbers = [];
        if (addMediaList) {
            for (let i = 0; i < userMediaIDList.length; i++) {
                addMediaList.forEach(Media => {
                    if (userMediaIDList[i].ID == Media.ID) {
                        if (!(StoryItemNumbers.includes(Media.item_number))) {
                            StoryItemNumbers.push(Media.item_number);
                            filteredAddMedias.push(Media);
                            if (userMediaIDList[i].visibility < Story.visibility) {
                                visibility = userMediaIDList[i].visibility;
                            };
                        } else {
                            badItemNumbers.push(Media.item_number);
                        };
                    } else {
                        badAddIDs.push(ID);
                    };
                });
            };

            const addItems = [];
            filteredAddMedias.forEach(Media => {
                addItems.push({
                    media_ID: Media.ID,
                    carousel_ID: Story.ID,
                    item_number: Media.item_number,
                    item_description: Media.description
                });
            });
            if (addItems.length != 0) {
                await carousel_medialist.bulkCreate(addItems);
            };
        };


        await Story.update({
            name: name ?? Story.name,
            visibility: visibility ?? Story.visibility,
            description: description ?? Story.description
        });

        await Story.save();

        const result = { story: Story };

        if (badAddIDs.length != 0) {
            result.bad_add_ids = badAddIDs;
        };
        if (badRemoveIDs.length != 0) {
            result.bad_remove_ids = badRemoveIDs;
        };
        if (badMediaIDs.length != 0) {
            result.bad_modify_ids = badMediaIDs;
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
    const userID = req_query.user_id;
    const createdStart = req.query.created_start ?? "1000-01-01";
    const createdEnd = req.query.created_end ?? currDate;
    const editStart = req.query.edit_start ?? "1000-01-01";
    const editEnd = req.query.edit_end ?? currDate;

    try {

        const query = { where: { [Op.and]: [{ created_date: { [Op.between]: [createdStart, createdEnd] } }, { modified_date: { [Op.between]: [editStart, editEnd] } }] }, include: [{ model: media, attributes: { exclude: ["deletedAt"] }, include: [{ model: tag, attributes: { exclude: ["deletedAt"] } }] }] };

        if (name) {
            query.where[Op.and].push({ name: name });
        };
        if (description) {
            query.where[Op.and].push({ description: description });
        };
        if (mediaIDs) {
            query.include[0].where = { ID: { [Op.in]: [mediaIDs] } };
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