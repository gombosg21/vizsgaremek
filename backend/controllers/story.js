const carousel = require('../models').carousel;
const carousel_medialist = require('../models').carousel_medialist;
const user = require('../models').user;
const tag = require('../models').tag;
const media = require('../models').media;
const profile = require('../models').profile;
const visibility = require('../helpers/authorization/visibility');

exports.createStory = async (req, res, next) => {
    const userID = req.user.ID;
    const name = req.body.name;
    const visibility = req.body.visibility;
    const description = req.body.description;
    const medias = req.body.medias;

    try {
        const newStory = await carousel.create({
            user_ID: userID,
            name: name,
            visibility: visibility,
            description: description
        });

        const carousel_medias = [];

        medias.forEach(media => {
            carousel_medias.push({
                media_ID: media.ID,
                carousel_ID: newStory.ID,
                item_number: media.item_number,
                item_description: media.description
            });
        });

        await carousel_medialist.bulkCreate(carousel_medias);

        return res.status(200).json({ ID: newStory.ID });

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
                            {
                                model: user, attributes: ["ID"], include: [{ model: profile, attributes: ['alias'] },
                                { model: tag, attributes: ["name", "ID"] }]
                            }]
                    }]
            });

        var userID = -1
        if (req.user) {
            userID = req.user.ID;
        };

        const visibilityFlag = Story.visibility;
        const dataOwnerID = Story.ID;

        const storyMediaList = [];

        Story.media.forEach(Media => {
            var mediaTagList = [];
            Media.tags.forEach(tag => { mediaTagList.push({ "name": tag.name }) });
            storyMediaList.push({
                ID: Media.ID,
                uploader: Media.user.name,
                file: Media.file_data,
                uploaded: Media.uploaded,
                description: Media.description,
                placeholder_text: Media.placeholder_text,
                tags: mediaTagList
            });
        });

        const data = {
            ID: Story.ID,
            name: Story.name,
            description: Story.description,
            created: Story.created_date,
            updated: Story.modified_date,
            media_list: storyMediaList
        };

        const result = await visibility.determineVisibility(userID, dataOwnerID, visibilityFlag, data);

        return res.status(result.status).json(result.data);

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
                { model: user, attributes: ['ID', 'name'] },
                {
                    model: media, include: [
                        { model: user, attributes: ['ID'], include: [{ model: profile, attributes: ['alias'] }] },
                        { model: tag, attributes: ['ID', 'name'] }]
                }]
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
                    uploader: Media.user.name,
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
    const visibility = req.body.visibility;
    const description = req.body.description;
    try {
        const Story = await carousel.findByPk(ID);

        await Story.update({
            name: name,
            visibility: visibility,
            description: description
        });

        return res.status(200).json({ ID: Story.ID })

    } catch (error) {
        console.error(error);
        res.status(500);
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