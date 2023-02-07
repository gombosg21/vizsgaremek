const media = require("../models").media;
const tag = require("../models").tag;
const taglist = require("../models").taglist;
const user = require("../models").user;

exports.viewOneMediaFromUser = async (req,res,next) => 
{
    const ownerID = req.params.user_ID
    const mediaID = req.params.media_ID;

    const MediaData = await media.findOne({where:{id : mediaID, user_ID: ownerID},include:{model:tag}})

    res.status(200).json(MediaData);
}

exports.getAllMediaFromUser = async (req,res,next) => 
{
    const ownerID = req.params.user_ID
    
    const MediaList = await media.findAll({where:{user_ID:ownerID},include:{model:tag}})
    
    res.status(200).json(MediaList);

}

exports.getMediaByTags = async (req,res,next) => 
{
    const tags = req.query.tags

    const MediaList = await media.findAll({where:{user_ID:ownerID},include:{model:tag,thorough:{model:taglist},include:[{name:[tags]}]}})
}

exports.uploadMedia = async (req,res,next) => 
{
    const Media = media.build(
        {
        user_ID : req.params.ID,
        data: req.body.imgData,
        description: req.body.description,
        visibility: req.body.visibility,
        placeholder_text: req.body.placeholder_text,
        tags: req.body.tags
        }
    )
    .catch(err => console.log(err))

    await Media.save()
    .then(res.status(200));
    ;
}

exports.deleteMedia  = async (req,res,next) => 
{
    const ID = req.params.media_ID;

    const Media = await media.findOne(ID);

        await Media.destroy()
        .then(
        res.status(200))
}

exports.editMedia  = async (req,res,next) => 
{
    const ID = req.params.media_ID

    const Media = await media.findOne({where:{id: ID}})
    .then(
        Media.update(
            {       
                description : req.body.description,
                visibility : req.body.visibility,
                placeholder_text : req.body.placeholder_text
            }
        )).catch(err => console.log(err))

    await Media.save()
    .then(res.status(200))
}
