const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect('mongodb+srv://'+ process.env.OP_MONGODB_USER + ':'+process.env.OP_MONGODB_PASSWORD+'@cluster0.ncadf.mongodb.net/'+process.env.OP_MONGODB_DATABASE+'?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err))