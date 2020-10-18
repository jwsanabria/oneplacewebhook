const {Router} = require('express');
const router = Router();
const {indexController, chatController, receivedWhatsapp, receiveFacebook} = require('../controllers/index.controller');

router.get('/', indexController);

router.get('/chat', chatController);

router.post("/hookWhatsapp", receivedWhatsapp);

router.post("/hookFacebook", receiveFacebook);

module.exports = router;