const valiadtor = require('express-validator');
const tag = require('../../models').tag;

exports.tagRules = () => {
    return[
        valiadtor.body("tag_name").notEmpty().withMessage("tag must not be empty"),
        valiadtor.body("tag_name").isAlpha().withMessage("tag can only contain letters"),
        valiadtor.body("tag_name").isLength({max:50}).withMessage("tag can only be 50 characters long max")
    ]
};

exports.checkIfTagDoesNotExsist = async (req,res,next) => 
{

    const tagName = req.body.tag_name;

    if (await tag.findOne({where:{name: tagName}} === null)) 
    {
        return res.status(406).json({"error":`${tagName} does not exsits`});
    } 
    else 
    {
        return next();
    }
};

exports.checkIfTagAlreadyExsits = async (req,res,next) => 
{

    const tagName = req.body.tag_name;

    if (await tag.findOne({where:{name: tagName}} === null)) 
    {
        return next();
    } 
    else 
    {
        return res.status(406).json({"error":`${tagName} already exsits`});
    }
};