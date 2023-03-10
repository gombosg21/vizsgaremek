const router = require('express').Router();
const tagController = require("../controllers/tag");
const tagValidator = require("../middlewares/validators/tag");
const commonValidator = require("../middlewares/validators/common");


//by ID
//change tagname
//delete tag
router.route("/tag/:ID")
    .patch(tagValidator.checkIfTagIDDoesNotExsits,tagValidator.tagRules(),commonValidator.validate,tagController.updateTag)
    .delete(tagValidator.checkIfTagIDDoesNotExsits,tagController.deleteTag);

    
// search tag by name    
router.get("/tag",tagValidator.searchRules(),commonValidator.validate,tagController.findTags);

//create new tag
router.post("/tag",tagValidator.tagRules(),commonValidator.validate,tagValidator.checkIfTagNameAlreadyExsits,tagController.deleteTag);


module.exports = router;