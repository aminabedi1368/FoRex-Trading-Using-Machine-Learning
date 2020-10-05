var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const SMA = require('technicalindicators').SMA;
const RSI = require('technicalindicators').RSI;
allData = [];

const CSVToJSON = require('csvtojson');
const brain = require('brain.js');


// convert users.csv file to JSON array
function createDataSet() {
    CSVToJSON().fromFile('eurusd_minute.csv')
        .then(eurusd_hour => {
            var ctr = 0;
            // users is a JSON array
            // log the JSON array
            eurusd_hour.forEach(element => {
                    // console.log(element.BidClose);
                    allData.push(parseFloat(element.BidClose));
                    ctr++;
                    // console.log(element.BidClose);
                    // console.log(allData);
                    // console.log(ctr);

                    if (ctr === eurusd_hour.length) {
                        // console.log(allData);
                        // fs = require('fs')
                        // fs.writeFile('./sma.txt', SMA.calculate({period : 10, values : allData}), function (err,data) {
                        //     if (err) {
                        //         return console.log(err);
                        //     }
                        //     console.log(data);
                        // });

                        var sma10 = SMA.calculate({period: 10, values: allData});
                        var sma5 = SMA.calculate({period: 5, values: allData});
                        var rsa10 = RSI.calculate({period: 10, values: allData});
                        for (i = 9; i < eurusd_hour.length; i++) {

                            try {
                                eurusd_hour[i - 9].resultLow = (eurusd_hour[i - 9].BidClose - Math.min(eurusd_hour[i - 8].BidLow, eurusd_hour[i - 7].BidLow, eurusd_hour[i - 6].BidLow, eurusd_hour[i - 6].BidLow, eurusd_hour[i - 5].BidLow, eurusd_hour[i - 4].BidLow, eurusd_hour[i - 3].BidLow, eurusd_hour[i - 2].BidLow, eurusd_hour[i - 1].BidLow));
                                eurusd_hour[i - 9].resultHight = Math.max(eurusd_hour[i - 8].BidHigh, eurusd_hour[i - 7].BidHigh, eurusd_hour[i - 6].BidHigh, eurusd_hour[i - 5].BidHigh, eurusd_hour[i - 4].BidHigh, eurusd_hour[i - 3].BidHigh, eurusd_hour[i - 2].BidHigh, eurusd_hour[i - 1].BidHigh) - eurusd_hour[i - 9].BidClose;
                            } catch (e) {
                                console.log("entering catch block");
                                console.log(e);
                                console.log("leaving catch block");
                            }

                            eurusd_hour[i].sma10 = sma10[i - 9];
                            console.log(eurusd_hour[i].sma10);
                            eurusd_hour[i - 5].sma5 = sma5[i - 9];
                            eurusd_hour[i].rsa10 = rsa10[i - 9];
                            console.log(i, '-------------', eurusd_hour.length);
                            var jsonContent = JSON.stringify(eurusd_hour[i]);
                            fs.appendFile('output-m.json', jsonContent, 'utf8',function (err) {
                                if (err) throw err;
                                // console.log('Saved!');
                            });

                            // if (i === eurusd_hour.length - 1) {
                            //     var jsonContent = JSON.stringify(eurusd_hour);
                            //     fs.writeFile("output-m.json", jsonContent, 'utf8', function (err) {
                            //         if (err) {
                            //             console.log("An error occured while writing JSON Object to File.");
                            //             return console.log(err);
                            //         }
                            //
                            //         console.log("JSON file has been saved.");
                            //     });
                            // }
                            // console.log(sma10);
                            // console.log(sma5);
                            // console.log(rsa10);
                        }
                        // console.log(element.BidClose);
                        // console.log(eurusd_hour.BidClose);
                    }
                }
            );
        }).catch(err => {
        // log error if any
        console.log(err);
    });
}

// createDataSet();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pre', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// provide optional config object (or undefined). Defaults shown.
const config = {
    binaryThresh: 0.0005,
    hiddenLayers: [60], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.001, // supported for activation type 'leaky-relu'
}
// create a simple feed forward neural network with backpropagation
// const net = new brain.NeuralNetwork(config);
const net = new brain.NeuralNetworkGPU(config);
var dataset = require('./output-m.json');
var realDataSet = [];
console.log("start train");
for (ii = 0; ii < (dataset.length - 5); ii++) {
    realDataSet.push({
        input: {
            BidOpen: parseFloat(dataset[ii].BidOpen),
            BidHigh: parseFloat(dataset[ii].BidHigh),
            BidLow: parseFloat(dataset[ii].BidLow),
            BidClose: parseFloat(dataset[ii].BidClose),

            sma10: parseFloat(dataset[ii].sma10),
            rsa10: parseFloat(dataset[ii].rsa10),
            sma5: parseFloat(dataset[ii].sma5),

            BidOpen_1: parseFloat(dataset[ii + 1].BidOpen),
            BidHigh_1: parseFloat(dataset[ii + 1].BidHigh),
            BidLow_1: parseFloat(dataset[ii + 1].BidLow),
            BidClose_1: parseFloat(dataset[ii + 1].BidClose),

            sma10_1: parseFloat(dataset[ii + 1].sma10),
            rsa10_1: parseFloat(dataset[ii + 1].rsa10),
            sma5_1: parseFloat(dataset[ii + 1].sma5),

            BidOpen_2: parseFloat(dataset[ii + 2].BidOpen),
            BidHigh_2: parseFloat(dataset[ii + 2].BidHigh),
            BidLow_2: parseFloat(dataset[ii + 2].BidLow),
            BidClose_2: parseFloat(dataset[ii + 2].BidClose),

            sma10_2: parseFloat(dataset[ii + 2].sma10),
            rsa10_2: parseFloat(dataset[ii + 2].rsa10),
            sma5_2: parseFloat(dataset[ii + 2].sma5),

            BidOpen_3: parseFloat(dataset[ii + 3].BidOpen),
            BidHigh_3: parseFloat(dataset[ii + 3].BidHigh),
            BidLow_3: parseFloat(dataset[ii + 3].BidLow),
            BidClose_3: parseFloat(dataset[ii + 3].BidClose),

            sma10_3: parseFloat(dataset[ii + 3].sma10),
            rsa10_3: parseFloat(dataset[ii + 3].rsa10),
            sma5_3: parseFloat(dataset[ii + 3].sma5),

            BidOpen_4: parseFloat(dataset[ii + 4].BidOpen),
            BidHigh_4: parseFloat(dataset[ii + 4].BidHigh),
            BidLow_4: parseFloat(dataset[ii + 4].BidLow),
            BidClose_4: parseFloat(dataset[ii + 4].BidClose),

            sma10_4: parseFloat(dataset[ii + 4].sma10),
            rsa10_4: parseFloat(dataset[ii + 4].rsa10),
            sma5_4: parseFloat(dataset[ii + 4].sma5)

        },
        output: {
            resultLow: parseFloat(dataset[ii + 4].resultLow),
            resultHigh: parseFloat(dataset[ii + 4].resultHigh)
        }
    });
     console.log(realDataSet[ii]);
}
console.log("start finall train");
net.trainAsync(realDataSet,{
    // Defaults values --> expected validation
    iterations: 2000000, // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.01, // the acceptable error percentage from training data --> number between 0 and 1
    log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 100000, // iterations between logging out --> number greater than 0
    learningRate: 0.03, // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.01, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 1000, // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: Infinity
})
    .then((res) => {
        // do something with my trained network
        console.log('finall res -------------->', res);

        // {
        //                resultLow_4: 0.0008500000000000174,
        //                resultHight_4: 0.0015999999999998238
        // }

        const output = net.run({
            BidOpen: 1.31108,
            BidHigh: 1.31158,
            BidLow: 1.31028,
            BidClose: 1.31038,
            BidChange: 0.0006999999999999229,

            sma10: 1.3110670000000015,
            rsa10: 38.43,
            sma5: 1.3102040000000037,
            BidOpen_1: 1.31038,
            BidHigh_1: 1.31218,
            BidLow_1: 1.30848,
            BidClose_1: 1.31098,
            BidChange_1: -0.0005999999999999339,

            sma10_1: 1.3108050000000016,
            rsa10_1: 32.94,
            sma5_1: 1.3100200000000037,
            BidOpen_2: 1.31098,
            BidHigh_2: 1.31248,
            BidLow_2: 1.30807,
            BidClose_2: 1.30867,
            BidChange_2: 0.0023100000000000342,

            sma10_2: 1.3103870000000015,
            rsa10_2: 41.43,
            sma5_2: 1.310498000000004,
            BidOpen_3: 1.30867,
            BidHigh_3: 1.31208,
            BidLow_3: 1.30748,
            BidClose_3: 1.3107799999999998,
            BidChange_3: -0.0021099999999998342,

            sma10_3: 1.3103200000000013,
            rsa10_3: 38.17,
            sma5_3: 1.310378000000004,
            BidOpen_4: 1.3107799999999998,
            BidHigh_4: 1.31375,
            BidLow_4: 1.3091,
            BidClose_4: 1.3095,
            BidChange_4: 0.0012799999999997258,

            sma10_4: 1.3101850000000013,
            rsa10_4: 40.6,
            sma5_4: 1.3100620000000038,
        });
        console.log('finall result -------------->', output);
        const jsonTrain = net.toJSON();
        var jsonContent = JSON.stringify(jsonTrain);
        fs.writeFile("jsonTrain.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }

            console.log("JSON file has been saved.");
        });
    })
    .catch();


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
