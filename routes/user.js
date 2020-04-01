var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url_mongo = "mongodb://heroku_m0h4274q:muqh1p3t4b927u0s6mcuvijkfg@ds245927.mlab.com:45927/heroku_m0h4274q";
var db = 'heroku_m0h4274q';

router.post('/', (req, res) => {
    MongoClient.connect(url_mongo, {
        useNewUrlParser: true
    }, (err, client) => {
        if(err) throw err;
        let email = req.query.email;
        if(!email) {
            res.status(400).send('Something broke');
        }
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