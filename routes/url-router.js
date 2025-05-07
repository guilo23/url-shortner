const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url-controller'); 

router.get('/', urlController.index);

router.post('/shortUrls', urlController.shortenUrl);

router.get('/:short', urlController.redirectUrl);

router.delete('/delete/:short', urlController.deleteUrl);

module.exports = router;