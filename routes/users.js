var express = require('express');
var router = express.Router();
const brain1 = require('brain.js');

const net1 = new brain1.NeuralNetworkGPU();
var result;
var jsonTrain = require('../jsonTrain1.json');
net1.fromJSON(jsonTrain);
conuter = 0;
console.log("start");
/* GET users listing. */
router.post('/', function (req, res, next) {
    console.log(conuter++);
    res.send(net1.run(req.body));

});
module.exports = router;
