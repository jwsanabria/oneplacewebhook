const express = require("express");
const exphbs = require('express-handlebars');
const path = require('path');
// Initialize express and define a port
const app = express();

// settings
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
app.use(require('./routes/index.routes'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;