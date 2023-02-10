const tag = require("../models").tag;
const { Op } = require("sequelize");

exports.createTag = async (req,res,next) => 
{
    const tagName = req.body.tag_name;

    try 
    {
        const newTag = await tag.build({
            name : tagName
        });

        await newTag.save();

        res.status(201)
        .json(newTag);
    }    
    catch (error) {
        console.log(error);
        res.status(502);
    }
}

exports.updateTag = async (req,res,next) => 
{
    const ID = req.params.ID;
    const tagName = req.body.tag_name;

    try 
    {
        const UpdateTag = await tag.findOne({where:{ID :ID}});
        UpdateTag.set({
            name: tagName
        });

        await UpdateTag.save();

        res.status(200)
        .json(UpdateTag.name);
    }    
    catch (error) {
        console.log(error);
        res.status(502);
    }
}

exports.deleteTag = async (req,res,next) => 
{
    const ID = req.params.ID;

    try 
    {
        const deleteTag = await tag.findOne({ where: { ID: ID } });
        await deleteTag.destroy();
        res.status(200)
        .json(deleteTag.ID);
    }    
    catch (error) {
        console.log(error);
        res.status(502);
    }
}

exports.findTags = async (req,res,next) => 
{
    const tagName = req.query.tag_name;

    try 
    {
        const TagArray = await tag.findAll({where:{name:{[Op.like]:`%${tagName}%`}},attributes:['name']})
        if (TagArray == null) 
        {
            res.status(404).json({"msg":"couldnt find results matching query parameters, try a different search"})
        } else 
        {
            res.status(200).json(TagArray);
        }
    }    
    catch (error) {
        console.log(error);
        res.status(502);
    }
}