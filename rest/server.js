const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
const client = new MongoClient(db.url, { useNewUrlParser: true });
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));
client.connect((err, database) => {
    if(err) return console.log(err);
    require('./app/routes')(app, database);
    app.listen(port, () => {
        console.log('Run on ' + port);
    });
});