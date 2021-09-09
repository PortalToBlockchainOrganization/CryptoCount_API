var Express = require("express");
//var Tags = require("../Validator.js").Tags;
var router = Express.Router({ caseSensitive: true });
var async = require("async");
//var { Session } = require("../Session.js");
let axios = require("axios");
const {
	realize,
	autoAnalysis,
} = require("./tzdelpre.js");


// tezos 
router.baseURL = "/Analysis";

//const RealizeHistObj = require("../../model/realize.js");
const BlockchainModel = require("../../../model/blockchain.js");
//const User = require("../../model/User.js");



// beta auto basis price calculation
router.get("/Auto", function (req, res) {
	//var vld = req.validator;
	var query = req.query;
	var unrel_obj = {};
	const address = query.address
    const fiat = query.fiat;
	console.log(address);
	console.log(fiat);
	//var prsId = req.session.prsId;
	async.waterfall(
		[
			async function (cb) {
					try {
						unrel_obj = await autoAnalysis(address, fiat);
						console.log(unrel_obj);
						return unrel_obj;
					} catch (error) {
						console.log("analysis error");
						console.log(error);
						return error;
					}
                },
			function (result, cb) {
				//after creating new rel db obj,
				// console.log(result)
				// console.log('results')
				console.log(result);
				res.send(result);
				cb();
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});


router.get("/AutoRealize", function (req, res) {
	//var vld = req.validator;
	var query = req.query;
	var unrel_obj = {};
    const address = query.address
	const realizingQuantity = query.realizingQuantity
    const fiat = query.fiat;
	console.log(address);
	console.log(fiat);
    console.log(realizingQuantity);
	//var prsId = req.session.prsId;
	async.waterfall(
		[
			async function (cb) {
					try {
						unrel_obj = await autoAnalysis(address, fiat);
						console.log(unrel_obj);
                        done_obj = await realize(unrel_obj, realizingQuantity)
						return done_obj;
					} catch (error) {
						console.log("analysis error");
						console.log(error);
						return error;
					}
            },
			function (result, cb) {
				//after creating new rel db obj,
				// console.log(result)
				// console.log('results')
				console.log(result);
				res.send(result);
				cb();
			},
		],
		function (err) {
			if (err) console.log(err);
		}
	);
});



Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

async function getBalances(address, price) {
	let balances = {};
	//offset from index
	let offset = 0;
	let resp_lens = 10000;
	while (resp_lens === 10000) {
		let url = `https://api.tzkt.io/v1/accounts/${address}/balance_history?offset=${offset}&limit=10000`;
		const response = await axios.get(url);
		resp_lens = response.data.length;
		offset += response.data.length; // update lastId, length of offset is all so it gets the length, then stops again while true because it fills the return of the query
		// api returns only changes
		// for each date, check date ahead and fill all dates upto that date
		for (let i = 0; i < response.data.length - 1; i++) {
			const element = response.data[i];
			//make this into normal date
			var d1 = element.timestamp.substring(0, 10);
			var d2 = response.data[i + 1].timestamp.substring(0, 10);

			if (d1 === d2) {
				balances[d1] = element.balance;
			} else {
				d1 = new Date(d1);
				d2 = new Date(d2);
				date_itr = d1;
				while (date_itr < d2) {
					date_key = date_itr.toISOString().slice(0, 10);
					balances[date_key] = {
						balance: response.data[i].balance,
						price: price[date_key],
					};
					date_itr = date_itr.addDays(1);
				}
			}
		}
	}
	return balances;
}

async function getPrices(fiat) {
	let price = `price${fiat}`;
	let marketCap = `marketCap${fiat}`;
	// console.log(price, marketCap)
	let priceAndMarketCapData = await BlockchainModel.find();
	let finalData = {};
	for (i = 0; i < priceAndMarketCapData.length; i++) {
		let date = priceAndMarketCapData[i].date;
        // convert year month day to month day year
        var date_arr1 = date.toString().split('-')
        var date_arr2 = [date_arr1[1], date_arr1[2], date_arr1[0]]
        date = date_arr2.join('-')

        let priceN = priceAndMarketCapData[i][price];
		let marketCapN = priceAndMarketCapData[i][marketCap];
		finalData[date] = priceN;
	}
	return finalData;
}

module.exports = router;