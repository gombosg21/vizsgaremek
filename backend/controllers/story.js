const carousel = require('../models').carousel;
const media = require('../models').media;
const visibility = require('../helpers/authorization/visibility');

exports.createStory = async (req, res, next) => {
    const userID = req.user.ID;
    const name = req.body.name;
    const visibility = req.body.visibility;
    const description = req.body.description;
    const mediaIDs = req.body.IDs;

    try {
        const newStory = await carousel.build({
            user_ID: userID,
            name: name,
            visibility: visibility,
            description: description
        });
        await newStory.setMedias(mediaIDs);

        await newStory.save();

        return res.status(200).json({ ID: newStory.ID });

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getStory = async (req, res, next) => {
    const ID = req.params.storyID;
    try {
        const Story = await carousel.findByPk(ID, { include: [{ model: user, attributes: ['ID', 'name'] }, { model: media }] });

        if (!req.user) {
            req.user.ID = -1;
        };
        const userContextID = req.user.ID;

        const visibilityFlag = Story.visibility;
        const dataOwnerID = Story.ID;

        const storyMediaList = [];

        Story.medias.forEach(Media => {
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

        const dataArray = {
            ID: Story.ID,
            name: Story.name,
            description: Story.description,
            created: Story.created_date,
            updated: Story.modified_date,
            media_list: storyMediaList
        };

        const result = await visibility.determineVisibility(userContextID, dataOwnerID, visibilityFlag, dataArray);

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getAllStoryFromUser = async (req, res, next) => {
    const userID = req.params.userID;
    try {
        const StoryList = await carousel.findAll({ where: { user_ID: userID }, include: [{ model: user, attributes: ['ID', 'name'] }, { model: media }] });

        if (!req.user) {
            req.user.ID = -1;
        };

        const userContextID = req.user.ID;
        const dataArray = [];
        const visibilityArray = [];

        StoryList.forEach(story => {
            visibilityArray.push(story.visibility);
        });

        StoryList.forEach(story => {
            var storyMediaList = [];
            story.medias.forEach(Media => {
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
    try {
        const Story = await carousel.findByPk(ID);

        await Story.update({
            
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