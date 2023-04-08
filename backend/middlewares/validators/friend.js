exports.checkIfNotSelf = (req, res, next) => {
    try {
        const userID = req.user.ID;
        const friendID = req.params.userID;
        if (userID == friendID) {
            return res.status(400).json({ error: "cannot do friend operation on oneself" });
        } else {
            return next();
        };
    } catch (error) {
        console.log(error);
        return res.status(500);
    };
};