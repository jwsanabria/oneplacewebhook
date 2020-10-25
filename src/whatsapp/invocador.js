const WSService = require('../whatsapp/wsroutine');


WSService.getWSUserAccounts('2').then(function (msg1, msg2) { console.log(msg1) });