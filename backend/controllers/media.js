const media = require("../models").media;
const tag = require("../models").tag;
const taglist = require("../models").taglist;
const user = require("../models").user;

exports.viewOneMediaFromUser = async (req,res,next) => 
{
    const ownerID = req.params.user_ID
    const mediaID = req.params.media_ID;
    // const authCookie = req.body.cookie;

    const Media = await media.findOne({where:{id : mediaID, user_ID: user_ID},include:{model:tag}})

    if (Media === null) 
    {
        res.status(404).json({"error":`media from user:${ownerID} with id:${mediaID} does not exist`})
    } 
    else 
    {
        // switch (Media.visibility) 
        // {
        //     case 0 : res.status(403).json({"error":"private content"});
        //     case 1 : res.status(403).json({"error":"friends only"});
        //     case 2 : if (authCookie != null) 
        //     {
        //         res.status(200).json(Media)
        //     } 
        //     else
        //     {
        //         res.status(403).json({"error":"registered users only"})
        //     }; 
        //     case 3 : }

        res.status(200).json(Media);
    }
}

exports.getAllMediaFromUser = async (req,res,next) => 
{
    const ownerID = req.params.ID
    
    const MediaList = await media.findAll({where:{user_ID:ownerID},include:{model:tag}})

    if (MediaList === null) 
    {
        res.status(404).json({"error":`user with id:${ownerID} does not exsist`})
    }
    else 
    {
        res.status(200).json(MediaList);
    }
}

exports.getMediaByTags = async (req,res,next) => 
{
    const tags = req.body.tags

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
    const media_ID = req.params.ID;

    const Media = await media.findOne(media_ID);
    if (Media === null) 
    {
        res.status(404)
        .json({"error":`media with ID:${media_ID} does not exist`})
    } 
    else 
    {
        await Media.delete(media_ID)
        .then(
        res.status(200))
    }
}

exports.editMedia  = async (req,res,next) => 
{
    const media_ID = req.params.ID

    const Media = await media.findByID(media_ID)

    if (Media === null) 
    {
        res.status(404).json({"error":`media with id:${media_ID} does not exist`})
    } 
    else 
    {
        Media.update(
            {       
                description : req.body.description,
                visibility : req.body.visibility,
                placeholder_text : req.body.placeholder_text
            }
        ).catch(err => console.log(err))
    await Media.save()
    .then(
    res.status(200))
    }
}