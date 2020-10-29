const {Router} = require('express');
const router = Router();
const {indexController, chatController, receivedWhatsapp, getHookFacebook, postHookFacebook, LeftMessagesController, contactmessagesController, messagesController} = require('../controllers/index.controller');

router.get('/', indexController);

router.get('/chat/:user', chatController);

router.post("/hookWhatsapp", receivedWhatsapp);

router.get("/hookFacebook", getHookFacebook);

router.post("/hookFacebook", postHookFacebook);

router.get('/leftmessages/:user', LeftMessagesController);

router.get('/contactmessages/:userid', contactmessagesController);

router.get('/messages/:socialnetwork/:useraccountid/:clientaccountid', messagesController);

module.exports = router;