const {Router} = require('express');
const router = Router();
const {indexController, chatController, receivedWhatsapp, getHookFacebook, postHookFacebook} = require('../controllers/index.controller');

router.get('/', indexController);

router.get('/chat', chatController);

router.post("/hookWhatsapp", receivedWhatsapp);

router.get("/hookFacebook", getHookFacebook);

router.post("/hookFacebook", postHookFacebook);

module.exports = router;