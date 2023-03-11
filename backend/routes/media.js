const router = require('express').Router();
const mediaController = require('../controllers/media');
const mediaValidator = require('../middlewares/validators/media')
const userValidator = require('../middlewares/validators/user');
const auth = require('../middlewares/authentiaction/auth');
const multer = require('multer');
const upload = multer({storage: new multer.memoryStorage()});


// create media with user_ID
router.post('/media/:media_ID',auth.isAuth,upload.single('image'),mediaController.uploadMedia)

// edit media with media_ID
router.patch('/media/:media_ID',auth.isAuth,mediaValidator.checkIfMediaIDExsist,mediaController.editMedia)

// delete media with media_ID
router.delete('/media/:media_ID',auth.isAuth,mediaValidator.checkIfMediaIDExsist,mediaController.deleteMedia)

// view media with media_ID
router.get('/media/:media_ID',mediaValidator.checkIfMediaIDExsist,mediaController.getMediaByID)

// view ALL media with user_ID
router.get('/media/all/:user_ID/',userValidator.checkIfUserIDExsits,mediaController.getAllMediaFromUser)

// view media by tags, search function
router.get('/media/by-tags/',mediaController.getAllMediaByTags)

// add reaction

// add tag
router.patch('/media/:mediaID/tags',)

module.exports = router;