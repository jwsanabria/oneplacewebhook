const {Router} = require('express');
const router = Router();
const {indexController, chatController, postHookWhatsapp, getHookFacebook, postHookFacebook, contactmessagesController, messagesController} = require('../controllers/index.controller');

router.get('/', indexController);

router.get('/chat', chatController);

router.post("/hookWhatsapp", postHookWhatsapp);

router.get("/hookFacebook", getHookFacebook);

router.post("/hookFacebook", postHookFacebook);

router.get('/contactmessages', contactmessagesController);

router.get('/messages/:socialnetwork/:useraccountid/:clientaccountid', messagesController);

module.exports = router;