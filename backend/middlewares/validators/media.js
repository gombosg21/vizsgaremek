const vailadtor = require('express-vailadtor');
const tags = require('../../models').tag;

exports.validateUpload = (req,res,next) => 
{
    const imgData = req.body.imgData;
    const placeholder = req.body.placeholder;
    const userID = req.session.userID;

    if (imgData === null || placeholder == null || userID == null) 
    {
        res.status(406);
        return;
    }
    else 
    {
        next();
    }
};

exports.valiadteEdit = (req,res,next) => 
{
    const placeholder = req.body.placeholder;

    if (placeholder == null) 
    {  
        res.status(406)
        return;
    }
    else 
    {
        next()
    }
};

exports.validateTags = async (req,res,next) => 
{
    const Tags = req.body.tags;

    if( Tags === null) 
    {
        res.status(406);
        return;
    } 
    else 
    {
        var badTag = false;
        for(let i = 0; i < Tags.lenght(); i++)
        {
            var tag = await tags.findOne(Tags[i]);
            if(tag === null) 
            {
                badTag = true;
            }    
        }
        if (badTag == true) 
        {
            res.status(406);
            return;
        } 
        else 
        {
            next();
        }
    }
};