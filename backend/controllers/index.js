exports.getIndex = (req,res,next) => {
    return res.status(200)
    .json({"msg":"index"});
};

exports.getFAQ = (req,res,next) => {
    return res.status(200)
    .json({"msg":"frequently asked questions"});
};

exports.getTOS = (req,res,next) => {
    return res.status(200)
    .json({"msg":"terms of service"});
};