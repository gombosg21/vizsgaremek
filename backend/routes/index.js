const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

/* GET home page. */
router.get('/',indexController.getIndex);

router.get('/terms-of-service', indexController.getTOS);

router.get('/faq',indexController.getFAQ);

module.exports = router;
