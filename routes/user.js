var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url_mongo = "mongodb://heroku_m6pw58z7:3m2jnsghpanegrhnu540iusr7g@ds155651.mlab.com:55651/heroku_m6pw58z7";
var db = 'heroku_m6pw58z7';

router.get('/', (req, res) => {
    MongoClient.connect(url_mongo, {
        useNewUrlParser: true
    }, (err, client) => {
        if(err) throw err;
        let email = req.query.email;
        client.db(db).collection("users").find({
            email: email
        }) .toArray((err, r) => {
            if(err) throw err;
            client.close();
            res.send(r);
        });
    });
});
router.put('/', (req, res) => {
    MongoClient.connect(url_mongo, {
        useNewUrlParser: true
    }, (err, client) => {
        if(err) throw err;
        let body = req.body;

        client.db(db).collection("users").findOneAndUpdate({
            email: body.email
        }, {
            $set: {
                profile: body.profile
            }
        }, {
            returnOriginal: false
        },
        (err, r) => {
            if(err) throw err;
            client.close();
            res.send(r);
        });
    });
});
module.exports = router;