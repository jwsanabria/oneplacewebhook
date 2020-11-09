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
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
      return res.send(200);
    } else {
      return next();
    }
  });
  

// routes
app.use(require('./routes/IndexRoutes'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;