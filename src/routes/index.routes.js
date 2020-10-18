const {Router} = require('express');
const router = Router();
const {indexController, chatController, receivedWhatsapp} = require('../controllers/index.controller');

router.get('/', indexController);

router.get('/chat', chatController);

router.post("/hookWhatsapp", receivedWhatsapp)

module.exports = router;