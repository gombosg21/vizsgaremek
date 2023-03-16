exports.preProrcessQueryTags = async (req, res, next) => {
    const tagNames = req.query.tags;
    const tagIDs = [];
    const validTagNames = [];

    for (var tagName of tagNames) {
        var singleTag = await tag.findOne({ where: { name: tagName }, attributes: ['ID'] });
        if (singleTag != null) {
            tagIDs.push(singleTag.ID);
            validTagNames.push(singleTag.name);
        };
    };
    req.query.tagIDs = tagIDs;
    req.query.tagNames = validTagNames;
    return next();
};