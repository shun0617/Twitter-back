var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    
    /*
    let body = req.body;
    if(!body.auth) {
        res.status(400).send('Something broke');*/
     
        res.send({
            auth: false
        });
    
    
});
module.exports = router;