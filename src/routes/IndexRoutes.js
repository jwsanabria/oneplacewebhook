const {Router} = require('express');
const router = Router();
const {indexController, chatController, postHookWhatsapp, getHookFacebook, postHookFacebook, contactmessagesController, messagesController, chatnewController, useraccountController, conversationnameController} = require('../controllers/IndexController');
const authController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/auth');

router.get('/', indexController);

router.get('/chat', chatController);

router.post("/hookWhatsapp", postHookWhatsapp);

router.get("/hookFacebook", getHookFacebook);

router.post("/hookFacebook", postHookFacebook);

router.get('/contactmessages', authMiddleware, contactmessagesController);

router.get('/messages/:socialnetwork/:useraccountid/:client', authMiddleware, messagesController);

router.post('/auth/register', authController.register);

router.post('/auth/login', authController.login);

router.post('/auth/validate', authController.validate_token);

router.get('/chatnew', chatnewController);

router.get('/account/', authMiddleware, useraccountController);

router.get('/conversationname/:userid/:clientaccountid/:conversationname', authMiddleware, conversationnameController);

module.exports = router;