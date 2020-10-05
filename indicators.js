const SMA = require('technicalindicators').SMA;
const RSI = require('technicalindicators').RSI;


var dataset = require('./output-m.json');
var request = require('request');
var realDataSet = []
// console.log(dataset);
for (var ii = dataset.length - 30000; ii < (dataset.length - 5); ii++) {
    realDataSet.push({
        input: {
            BidOpen: parseFloat(dataset[ii].BidOpen),
            BidHigh: parseFloat(dataset[ii].BidHigh),
            BidLow: parseFloat(dataset[ii].BidLow),
            BidClose: parseFloat(dataset[ii].BidClose),
            BidChange: parseFloat(dataset[ii].BidChange),
            AskOpen: parseFloat(dataset[ii].AskOpen),
            AskHigh: parseFloat(dataset[ii].AskHigh),
            AskLow: parseFloat(dataset[ii].AskLow),
            AskClose: parseFloat(dataset[ii].AskClose),
            AskChange: parseFloat(dataset[ii].AskChange),
            sma10: parseFloat(dataset[ii].sma10),
            rsa10: parseFloat(dataset[ii].rsa10),
            sma5: parseFloat(dataset[ii].sma5),

            BidOpen_1: parseFloat(dataset[ii + 1].BidOpen),
            BidHigh_1: parseFloat(dataset[ii + 1].BidHigh),
            BidLow_1: parseFloat(dataset[ii + 1].BidLow),
            BidClose_1: parseFloat(dataset[ii + 1].BidClose),
            BidChange_1: parseFloat(dataset[ii + 1].BidChange),
            AskOpen_1: parseFloat(dataset[ii + 1].AskOpen),
            AskHigh_1: parseFloat(dataset[ii + 1].AskHigh),
            AskLow_1: parseFloat(dataset[ii + 1].AskLow),
            AskClose_1: parseFloat(dataset[ii + 1].AskClose),
            AskChange_1: parseFloat(dataset[ii + 1].AskChange),
            sma10_1: parseFloat(dataset[ii + 1].sma10),
            rsa10_1: parseFloat(dataset[ii + 1].rsa10),
            sma5_1: parseFloat(dataset[ii + 1].sma5),

            BidOpen_2: parseFloat(dataset[ii + 2].BidOpen),
            BidHigh_2: parseFloat(dataset[ii + 2].BidHigh),
            BidLow_2: parseFloat(dataset[ii + 2].BidLow),
            BidClose_2: parseFloat(dataset[ii + 2].BidClose),
            BidChange_2: parseFloat(dataset[ii + 2].BidChange),
            AskOpen_2: parseFloat(dataset[ii + 2].AskOpen),
            AskHigh_2: parseFloat(dataset[ii + 2].AskHigh),
            AskLow_2: parseFloat(dataset[ii + 2].AskLow),
            AskClose_2: parseFloat(dataset[ii + 2].AskClose),
            AskChange_2: parseFloat(dataset[ii + 2].AskChange),
            sma10_2: parseFloat(dataset[ii + 2].sma10),
            rsa10_2: parseFloat(dataset[ii + 2].rsa10),
            sma5_2: parseFloat(dataset[ii + 2].sma5),

            BidOpen_3: parseFloat(dataset[ii + 3].BidOpen),
            BidHigh_3: parseFloat(dataset[ii + 3].BidHigh),
            BidLow_3: parseFloat(dataset[ii + 3].BidLow),
            BidClose_3: parseFloat(dataset[ii + 3].BidClose),
            BidChange_3: parseFloat(dataset[ii + 3].BidChange),
            AskOpen_3: parseFloat(dataset[ii + 3].AskOpen),
            AskHigh_3: parseFloat(dataset[ii + 3].AskHigh),
            AskLow_3: parseFloat(dataset[ii + 3].AskLow),
            AskClose_3: parseFloat(dataset[ii + 3].AskClose),
            AskChange_3: parseFloat(dataset[ii + 3].AskChange),
            sma10_3: parseFloat(dataset[ii + 3].sma10),
            rsa10_3: parseFloat(dataset[ii + 3].rsa10),
            sma5_3: parseFloat(dataset[ii + 3].sma5),

            BidOpen_4: parseFloat(dataset[ii + 4].BidOpen),
            BidHigh_4: parseFloat(dataset[ii + 4].BidHigh),
            BidLow_4: parseFloat(dataset[ii + 4].BidLow),
            BidClose_4: parseFloat(dataset[ii + 4].BidClose),
            BidChange_4: parseFloat(dataset[ii + 4].BidChange),
            AskOpen_4: parseFloat(dataset[ii + 4].AskOpen),
            AskHigh_4: parseFloat(dataset[ii + 4].AskHigh),
            AskLow_4: parseFloat(dataset[ii + 4].AskLow),
            AskClose_4: parseFloat(dataset[ii + 4].AskClose),
            AskChange_4: parseFloat(dataset[ii + 4].AskChange),
            sma10_4: parseFloat(dataset[ii + 4].sma10),
            rsa10_4: parseFloat(dataset[ii + 4].rsa10),
            sma5_4: parseFloat(dataset[ii + 4].sma5)

        },
        output: {
            resultLow: parseFloat(dataset[ii + 4].resultLow),
            resultHight: parseFloat(dataset[ii + 4].resultHigh)
        }
    });
    // console.log(realDataSet[ii]);
}
// console.log(realDataSet);
// return;
var goodCandles = realDataSet.filter(candles => candles.output['resultLow'] > 0.0005 || candles.output['resultHight'] > 0.0005)
console.log(goodCandles.length);

// goodCandles.forEach(element => {

//     console.log(element.output);
// });

var trueLow = 0;
var trueHigh = 0;
goodCandles.forEach(candle => {
    var options = {
        'method': 'POST',
        'url': 'http://localhost:3000/pre',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(candle.input),
    };
    // console.log(options);
    request(options, function (error, response) {
        // if (error) console.log(error);
        // console.log(response.body);
//   console.log(candle.output);
//   if(candle.output['resultLow']>0.002  && Math.abs(candle.output['resultLow'] - JSON.parse(response.body)['resultLow'])<0.001 ) {
//     trueLow++;
//     console.log(candle.output['resultLow'] ,JSON.parse(response.body).resultLow, Math.abs(candle.output['resultLow'] - JSON.parse(response.body)['resultLow']) );}
//   if(candle.output['resultHigh']>0.002  && Math.abs(candle.output['resultHigh'] - JSON.parse(response.body)['resultHight'])<0.001 ) {
//     trueHigh++;
//     console.log(candle.output['resultHigh'] ,JSON.parse(response.body).resultHight, Math.abs(candle.output['resultHigh'] - JSON.parse(response.body)['resultHight']) );
//   }
        ////////////////////////////////////////////////////////////////
     try{
          // console.log("resultHight",JSON.parse(response.body).resultHight);
          // console.log("resultLow",JSON.parse(response.body).resultLow);
         if (JSON.parse(response.body)['resultLow'] > 0.0005 || candle.output['resultLow'] > 0.0005) {
             trueLow++;
             console.log("resultLow in if",candle.output['resultLow'], JSON.parse(response.body).resultLow, Math.abs(candle.output['resultLow'] - JSON.parse(response.body)['resultLow']));
         }
         if (JSON.parse(response.body)['resultHight'] > 0.0005 || candle.output['resultHight'] > 0.0005) {
             trueHigh++;
             // console.log("resultHight in if ",candle.output)
             console.log("resultHight in if ",candle.output['resultHight'], JSON.parse(response.body).resultHight, Math.abs(candle.output['resultHight'] - JSON.parse(response.body)['resultHight']));
         }

     }
     catch (e) {
     }

       });

});

setTimeout(function () {
    console.log(trueLow, trueHigh)
}, 10000);
