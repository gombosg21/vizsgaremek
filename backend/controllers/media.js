const media = require("../models/media")

exports.viewMedia() = async (req,res,next) => 
{
    const ID = req.params.ID;
    const authCookie = req.body.cookie;

    const Media = await media.findByID(ID)

    if (Media === null) 
    {
        res.status(404).json({"error":`media wiht id:${ID} does not exist`})
    } 
    else 
    {
        switch (Media.visibility) 
        {
            case 0 : res.status(403).json({"error":"private content"});
            case 1 : res.status(403).json({"error":"friends only"});
            case 2 : if (authCookie != null) 
            {
                res.status(200).json(Media)
            } 
            else
            {
                res.status(403).json({"error":"registered users only"})
            }; 
            case 3 : res.status(200).json(Media);
        } 
    }
}

exports.uploadMedia() = async (req,res,next) => 
{
    const Media = media.build(
        {
        user_ID : req.body.ID,
        data: req.body.imgData,
        description: req.body.description,
        visibility: req.body.visibility,
        placeholder_text: req.body.placeholder_text,
        tags: req.body.tags

        }
    )
    .catch(err => console.log(err))
    await Media.save();
    res.status(200);
}

exports.deleteMedia()  = async (req,res,next) => 
{
    const media_ID = req.params.media_ID;
    const authCookie = req.body.cookie;

    const Media = await media.findOne(media_ID);
    if (Media === null) 
    {
        res.status(404).json({"error":`media with ID:${media_ID} does not exist`})
    } 
    else 
    {
        if (authCookie =! null) 
        {
            await Media.delete(media_ID)
            res.status(200)
        }
        else 
        {
            res.status(403).json({"error":"insufficient privilegdes"})
        }
    }
}

exports.editMedia()  = async (req,res,next) => 
{
    const user_ID = req.params.user_ID
    const media_ID = req.params.media_ID

    const Media = await media.findByID(media_ID)

    if (Media === null) 
    {
        res.status(404).json({"error":`media with id:${media_ID} does not exist`})
    } 
    else 
    {
        Media.build({       
        description : req.body.description,
        visibility : req.body.visibility,
        placeholder_text : req.body.placeholder_text
        }).catch(err => console.log(err))
    await Media.save();
    res.status(200)
    }
}