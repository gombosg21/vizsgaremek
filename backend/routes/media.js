const router = require('express').Router();
const mediaController = require('../controllers/media');
const mediaValidator = require('../middlewares/validators/media')
const userValidator = require('../middlewares/validators/user');


// create media with user_ID
router.post('/media/:mediaID',mediaController.uploadMedia)

// edit media with media_ID
router.patch('/media/:mediaID',mediaValidator.checkIfMediaIDExsist,mediaController.editMedia)

// delete media with media_ID
router.delete('/media/:mediaID',mediaValidator.checkIfMediaIDExsist,mediaController.deleteMedia)

// view media with media_ID
router.get('/media/:userID/:mediaID',userValidator.checkIfUserIDExsits,mediaValidator.checkIfMediaIDExsist,mediaController.viewOneMediaFromUser)

// view ALL media with user_ID
router.get('/media/:userID/all',userValidator.checkIfUserIDExsits,mediaController.getAllMediaFromUser)

// view media by tags, search function
router.get('/media/by-tags',)

// add reaction

// add tag
router.patch('/media/:mediaID/tags',)

module.exports = router;