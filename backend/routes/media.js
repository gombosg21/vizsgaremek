const express = require('express');
const mediaController = require('../controllers/media');
const router = express.Router();

// create media with user_ID
router.post('/media/:ID',mediaController.uploadMedia)

// edit media with media_ID
router.patch('/media/:ID',mediaController.editMedia)

// delete media with media_ID
router.delete('/media/:ID',mediaController.deleteMedia)

// view media with media_ID
router.get('/media/:ownerID/:mediaID',mediaController.viewOneMediaFromUser)

// view ALL media with user_ID
router.get('/media/:ID/all',mediaController.getAllMediaFromUser)

// view media by tags
router.get('/media/by-tags',)

// add reaction

// add tag
router.patch('/media/:ID/tags',)