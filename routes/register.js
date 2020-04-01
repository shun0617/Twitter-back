var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
const bcrypt = require('bcrypt');
var MongoClient = mongodb.MongoClient;
var url_mongo = "mongodb://heroku_m0h4274q:muqh1p3t4b927u0s6mcuvijkfg@ds245927.mlab.com:45927/heroku_m0h4274q";
var db = 'heroku_m0h4274q';

router.post('/', (req, res) => {
    MongoClient.connect(url_mongo, {
        useNewUrlParser: true
    }, (err, client) => {
        if(err) throw err;
        let body = req.body;
        if(!body.name || !body.email || !body.password || !body.profile) {
            res.status(400).send('Something broke');
        }
        let hashed_password = bcrypt.hashSync(body.password, 10);
        let data = {
            name: body.name,
            email: body.email,
            password: hashed_password,
            profile: body.profile,
        }
        client.db(db).collection("users").insertOne(data,(err, r) => {
            if(err) throw err;
            client.close();
            res.send(r);
        });
    });
});
module.exports = router;