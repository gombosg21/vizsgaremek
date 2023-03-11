const router = require('express').Router();
const mediaController = require('../controllers/media');
const mediaValidator = require('../middlewares/validators/media')
const userValidator = require('../middlewares/validators/user');
const auth = require('../middlewares/authentiaction/auth');
const multer = require('multer');
const upload = multer({storage: new multer.memoryStorage()});


// create media with user_ID
router.post('/media/:mediaID',auth.isAuth,upload.single('image'),mediaController.uploadMedia)

// edit media with media_ID
router.patch('/media/:mediaID',auth.isAuth,mediaValidator.checkIfMediaIDExsist,mediaController.editMedia)

// delete media with media_ID
router.delete('/media/:mediaID',auth.isAuth,mediaValidator.checkIfMediaIDExsist,mediaController.deleteMedia)

// view media with media_ID
router.get('/media/:mediaID',mediaValidator.checkIfMediaIDExsist,mediaController.getMediaByID)

// view ALL media with user_ID
router.get('/media/all/:userID',userValidator.checkIfUserIDExsits,mediaController.getAllMediaFromUser)

// view media by tags, search function
router.get('/media/by-tags/',mediaController.getAllMediaByTags)

// add reaction

// add tag
router.patch('/media/:mediaID/tags',)

module.exports = router;