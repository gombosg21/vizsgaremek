const tag = require("../models").tag;
const media_taglist = require("../models").media_taglist;
const { Op, col, fn } = require("sequelize");

exports.createTag = async (req, res, next) => {
    const Name = req.body.name;

    try {
        const newTag = await tag.build({
            name: Name
        });

        await newTag.save();

        return res.status(201)
            .json({
                ID: newTag.ID,
                name: newTag.name
            });

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.updateTag = async (req, res, next) => {
    const ID = req.params.ID;
    const NewName = req.body.name;

    try {
        const UpdateTag = await tag.findByPk(ID, { attributes: ['name', 'ID'] });

        UpdateTag.update({
            name: NewName
        });

        await UpdateTag.save();

        return res.status(200)
            .json(UpdateTag);
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.deleteTag = async (req, res, next) => {
    const ID = req.params.ID;

    try {
        const deleteTag = await tag.findByPk(ID);

        await deleteTag.destroy();
        return res.status(200)
            .json({
                ID: deleteTag.ID,
                name: deleteTag.name
            });

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.findTags = async (req, res, next) => {
    const tagName = req.query.name;

    try {
        const TagArray = await tag.findAll({ where: { name: { [Op.substring]: tagName } }, attributes: ['ID', 'name'] });
        if (TagArray == null) {
            return res.status(200).json({ "msg": "mo matching tags found, try a different search" })
        } else {
            return res.status(200).json({ results: TagArray });
        };
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.getAllTags = async (req, res, next) => {
    try {
        const tagListRaw = await tag.findAll({ attributes: ['ID', 'name'], include: [{ model: media_taglist, attributes: [[fn('COUNT', 'tag_ID'), 'count']] }], group: ['tag_ID'] });
        const tagList = tagListRaw.map((obj) => ({ ID: obj.ID, name: obj.name, count: obj.media_taglists[0].dataValues.count }));

        return res.status(200).json(tagList);
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};