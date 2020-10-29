const mongoose = require('mongoose');
const config = require('./config')

console.log('Usuario: ' + config.mongoDbUser);

mongoose.connect('mongodb+srv://'+ config.mongoDbUser + ':'+config.mongoDbPassword+'@cluster0.ncadf.mongodb.net/'+config.montoDbDatabase+'?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err))