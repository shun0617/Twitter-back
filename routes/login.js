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
        if(!body.email || !body.password) {
            res.status(400).send('Something broke');
        }
        client.db(db).collection("users").find({
            email: body.email,
        }) .toArray((err, r) => {
            if(err) throw err;
            if(bcrypt.compareSync(body.password, r[0].password)) {
                client.close();
                res.send({
                    auth: false
                });
            }
        });
    });
});
module.exports = router;