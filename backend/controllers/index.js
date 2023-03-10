exports.getIndex = (req,res,next) => {
    res.status(200)
    .json({"msg":"index"});
};

exports.getFAQ = (req,res,next) => {
    res.status(200)
    .json({"msg":"frequently asked questions"});
};

exports.getTOS = (req,res,next) => {
    res.status(200)
    .json({"msg":"terms of service"});
};