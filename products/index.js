const express = require('express');
const mongoose = require('mongoose');
require('./app/models');
const config = require('./config');

const app = express();
config.express(app);
config.routes(app);

const { appPort, mongoUri } = config.app;

mongoose.connect(mongoUri, { useUnifiedTopology: true })
    .then(() => app.listen(
        appPort,
        () => console.log(`Run on ` + appPort)
    ));