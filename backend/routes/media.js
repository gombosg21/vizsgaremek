const express = require('express');
const mediaController = require('../controllers/media');
const router = express.Router();

// create media with user_ID
router.post('/media/:ID',mediaController.uploadMedia())

// edit media with media_ID
router.patch('/media/:ID',mediaController.editMedia())

// view media with media_ID
router.get('/media/:ID',mediaController.viewMedia())

// delete media with media_ID

router.delete('/media/:ID',deleteMedia())

// view ALL media with user_ID

// add reaction

// add tags

// view reactions