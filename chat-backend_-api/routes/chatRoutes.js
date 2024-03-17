const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/connect', chatController.connect);
router.post('/chat', chatController.chat);
router.post('/disconnect', chatController.disconnect);

module.exports = router;