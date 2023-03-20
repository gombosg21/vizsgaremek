exports.setTargetType = (type) => {
    return (req, res, next) => {
        req.params.parent_type = type;
        return next();
    };
};