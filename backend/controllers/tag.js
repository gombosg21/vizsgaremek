const tag = require("../models").tag;
const { Op } = require("sequelize");

exports.createTag = async (req, res, next) => {
    const tagName = req.body.tag_name;

    try {
        const newTag = await tag.build({
            name: tagName
        });

        await newTag.save();

        res.status(201)
            .json({
                ID: newTag.ID,
                name: newTag.name
            });

    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.updateTag = async (req, res, next) => {
    const ID = req.params.ID;
    const tagName = req.body.tag_name;

    try {
        const UpdateTag = await tag.findByPk(ID, { attributes: ['name', 'ID'] });

        UpdateTag.set({
            name: tagName
        });

        await UpdateTag.save();

        res.status(200)
            .json(UpdateTag);
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.deleteTag = async (req, res, next) => {
    const ID = req.params.ID;

    try {
        const deleteTag = await tag.findByPk(ID);

        await deleteTag.destroy();
        res.status(200)
            .json({ ID: deleteTag.ID });

    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.findTags = async (req, res, next) => {
    const tagName = req.query.tag_name;

    try {
        const TagArray = await tag.findAll({ where: { name: { [Op.substring]: tagName } }, attributes: ['ID', 'name'] });
        if (TagArray == null) {
            res.status(200).json({ "msg": "mo matching tags found, try a different search" })
        } else {
            res.status(200).json({ results: TagArray });
        };
    }
    catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.getAllTags = async (req, res, next) => {
    try {
        const tagList = await tag.findAll({ attributes: ['ID', 'name'] });

        res.status(200).json({ tags: tagList });
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};