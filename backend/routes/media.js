const router = require('express').Router();
const mediaController = require('../controllers/media');
const mediaValidator = require('../middlewares/validators/media');
const validate = require("../middlewares/validators/common").validate;
const userValidator = require('../middlewares/validators/user');
const auth = require('../middlewares/authentiaction/auth');
const ownership = require('../middlewares/authentiaction/ownership');
const multer = require('multer');
const upload = multer({ storage: new multer.memoryStorage() });


// create media with user_ID
router.post('/media', auth.isAuth, upload.single('image'), mediaValidator.uploadRules(), validate, mediaController.uploadMedia);

// edit media with media_ID
// delete media with media_ID
// view media with media_ID
router.route('/media/:mediaID')
    .patch(auth.isAuth, ownership.isMyMedia, mediaValidator.checkIfMediaIDExsist, mediaValidator.editRules(), validate, mediaController.editMedia)
    .delete(auth.isAuth, ownership.isMyMedia, mediaValidator.checkIfMediaIDExsist, mediaController.deleteMedia)
    .get(mediaValidator.checkIfMediaIDExsist, auth.optionalAuth, mediaController.getMediaByID);

// view ALL media with user_ID
router.get('/media/all/:userID', userValidator.checkIfUserIDExsits, auth.optionalAuth, mediaController.getAllMediaFromUser);

// view media by tags, search function
router.get('/media/search/tags', auth.optionalAuth, mediaController.getAllMediaByTags);

// edit tags
router.patch('/media/:mediaID/tags', auth.isAuth, mediaValidator.editTagRules(), validate, mediaController.editMediaTags);

module.exports = router;