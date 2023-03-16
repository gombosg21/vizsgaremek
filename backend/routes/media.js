const router = require('express').Router();
const mediaController = require('../controllers/media');
const mediaValidator = require('../middlewares/validators/media')
const userValidator = require('../middlewares/validators/user');
const auth = require('../middlewares/authentiaction/auth');
const ownership = require('../middlewares/authentiaction/ownership');
const multer = require('multer');
const upload = multer({ storage: new multer.memoryStorage() });


// create media with user_ID
router.post('/media', auth.isAuth, upload.single('image'), mediaController.uploadMedia)

// edit media with media_ID
// delete media with media_ID
// view media with media_ID
router.route('/media/:mediaID')
    .patch(auth.isAuth, ownership.isMyMedia, mediaValidator.checkIfMediaIDExsist, mediaController.editMedia)
    .delete(auth.isAuth, ownership.isMyMedia, mediaValidator.checkIfMediaIDExsist, mediaController.deleteMedia)
    .get(mediaValidator.checkIfMediaIDExsist, mediaController.getMediaByID)

// view ALL media with user_ID
router.get('/media/all/:userID', userValidator.checkIfUserIDExsits, mediaController.getAllMediaFromUser)

// view media by tags, search function
router.get('/media/search/tags', mediaController.getAllMediaByTags)

// add reaction
router.patch('/media/:mediaID/reactions');

// edit tags
router.patch('/media/:mediaID/tags', auth.isAuth, mediaController.editMediaTags)

module.exports = router;