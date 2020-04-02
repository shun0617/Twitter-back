var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url_mongo = "mongodb://heroku_m6pw58z7:3m2jnsghpanegrhnu540iusr7g@ds155651.mlab.com:55651/heroku_m6pw58z7";
var db = 'heroku_m6pw58z7';
var ObjectId = require('mongodb').ObjectID;

router.get('/', (req, res) => {
    MongoClient.connect(url_mongo, {
        useNewUrlParser: true
    }, (err, client) => {
        if(err) throw err;
        client.db(db).collection("shares").find().sort({
            created_at: -1,
        }) .toArray((err, r) => {
            if(err) throw err;
            client.close();
            res.send(r);
        });
    });
});

router.get('/:share_id', (req, res) => {
    MongoClient.connect(url_mongo, {
        useNewUrlParser: true
    }, (err, client) => {
        if(err) throw err;
        let share_id = req.params.share_id;
        if(!share_id) {
            res.status(400).send('Something broke');
        } else {
            client.db(db).collection("shares").find({
                _id: ObjectId(share_id)
            }) .toArray(async (err, r) => {
                if(err) throw err;
                let share_id = r[0]._id
                let user_id = r[0].user_id
                const like = await
                client.db(db).collection("likes").find({
                    share_id: share_id
                }) .toArray()
                const comments = await
                client.db(db).collection("comments").find({
                    share_id: share_id
                }) .toArray()
                const name = await
                client.db(db).collection("users").find({
                    _id: ObjectId(user_id)
                }) .toArray()
                const data = {
                    share_id: share_id,
                    user_id: user_id,
                    name: name[0].name,
                    share: r[0].share,
                    like: like,
                    comments: comments
                }
                client.close();
                res.send(data);
            });
        }
    });
});

router.delete('/:share_id', (req, res) => {
    MongoClient.connect(url_mongo, {
        useNewUrlParser: true
    }, (err, client) => {
        let id = req.params.share_id;
        if(!id) {
            res.status(400).send('Something broke');
        } else {
            client.db(db).collection("shares").remove({
                _id: ObjectId(id)
            }, (err, r) => {
                if(err) throw err;
                client.close();
                res.send(r);
            });
        }
    });
});

router.post('/:share_id/like', (req, res) => {
    MongoClient.connect(url_mongo, {
        useNewUrlParser: true
    }, (err, client) => {
        if(err) throw err;
        let body = req.body;
        let share_id = req.params.share_id;
        let data = {
            user_id: ObjectId(body.user_id),
            share_id: ObjectId(share_id)
        }
        if(!body.user_id || !share_id) {
            res.status(400).send('Something broke');
        } else {
            client.db(db).collection("likes").insertOne(data, (err, r) => {
                if(err) throw err;
                client.close();
                res.send(r);
            });
        }
    });
});

router.delete('/:share_id/like', (req, res) => {
    MongoClient.connect(url_mongo, {
        useNewUrlParser: true
    }, (err, client) => {
        if(err) throw err;
        let user_id = req.query.user_id;
        let share_id = req.params.share_id;
        if(!user_id || !share_id) {
            res.status(400).send('Something broke');
        } else {
            client.db(db).collection("likes").remove({
                user_id: ObjectId(user_id),
                share_id: ObjectId(share_id)
            }, (err, r) => {
                if(err) throw err;
                client.close();
                res.send(r);
            });
        }
    });
});

router.post('/:share_id/comments', (req, res) => {
    MongoClient.connect(url_mongo, {
        useNewUrlParser: true
    }, (err, client) => {
        if(err) throw err;
        let body = req.body;
        let share_id = req.params.share_id;
        /*
        if(!body.content || !body.name || !share_id) {
            res.status(400).send('Something broke');
        } else {
            */
            client.db(db).collection("comments").insertOne({
                share_id: ObjectId(share_id),
                name: body.name,
                content: body.content
            }, (err, r) => {
                if(err) throw err;
                client.close();
                res.send(r);
            });
    });
});
module.exports = router;
