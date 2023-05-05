const router = require('express').Router();
const tagController = require("../controllers/tag");
const tagValidator = require("../middlewares/validators/tag");
const commonValidator = require("../middlewares/validators/common");
const auth = require("../middlewares/authentiaction/auth");


//by ID
//change tagname
//delete tag
router.route("/tag/:ID")
    .patch(auth.isAuth, tagValidator.checkIfTagIDExsits, tagValidator.tagRules(), commonValidator.validate, tagController.updateTag)
    .delete(auth.isAuth, tagValidator.checkIfTagIDExsits, tagController.deleteTag);

// get all tags   
router.get("/tag/all", tagController.getAllTags);

// search tag by name    
router.get("/tag", tagValidator.searchRules(), commonValidator.validate, tagController.findTags);

//create new tag
router.post("/tag", auth.isAuth, tagValidator.tagRules(), commonValidator.validate, tagValidator.checkIfTagNameAlreadyExsits, tagController.createTag);


module.exports = router;