
'use strict';


const express = require('express');
const expressHandlebars = require('express-handlebars');
const handlebars = expressHandlebars.create({});
const path = require('path');
const app = express();

const controllers = require('./controllers');
const webServer = require('./webServer');


app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


app.use(controllers);

require('./bootstrap')
    .done(function () {
        webServer.run(app);
    });


module.exports = app;

