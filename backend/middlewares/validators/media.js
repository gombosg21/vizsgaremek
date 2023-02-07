const valiadtor = require('express-validator');
const media = require('../../models').media;
const tags = require('../../models').tag;


exports.uploadRules = () => 
{
    return [
        valiadtor.body('imgData').notEmpty().withMessage("cannot upload, no image given"),
        valiadtor.body('placeholder').notEmpty().withMessage("placeholder text cannot be empty")
    ]
}

exports.editRules = () => 
{
    return [
        valiadtor.body('placeholder').notEmpty().withMessage("placeholder text cannot be empty")
    ]
}

exports.checkIfMediaIDExsist = async (req,res,next) => 
{
    const mediaID = req.params.mediaID;

    if(await  media.findOne({where:{id : mediaID}}) == null) 
    {
        return res.status(404).json({"error":`media with id:${mediaID} does not exsist`});
    } 
    else 
    {
        return next();
    }
}

exports.validateUpload = (req,res,next) => 
{
    const errors = validator.validationResult(req)

    if (errors.isEmpty()) 
    {
       return next();
    }

    const errorList = [];
    errors.array().map(err => errorList.push({[err.param]:err.msg}))

    return res.status(422).json({error: errorList})
};

exports.valiadteEdit = (req,res,next) => 
{
    const errors = validator.validationResult(req)

    if (errors.isEmpty()) 
    {
       return next();
    }

    const errorList = [];
    errors.array().map(err => errorList.push({[err.param]:err.msg}))

    return res.status(422).json({error: errorList})
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