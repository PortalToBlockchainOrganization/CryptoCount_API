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
	const consensusRole = query.consensusRole
	console.log(address);
	console.log(fiat);
	//var prsId = req.session.prsId;
	async.waterfall(
		[
			async function (cb) {
					try {
						unrel_obj = await autoAnalysis(address, fiat, consensusRole);
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
	const consensusRole = query.consensusRole
	console.log(address);
	console.log(fiat);
    console.log(realizingQuantity);
	//var prsId = req.session.prsId;
	async.waterfall(
		[
			async function (cb) {
					try {
						unrel_obj = await autoAnalysis(address, fiat, consensusRole);
						console.log(unrel_obj);
                        done_obj = await realize(unrel_obj, realizingQuantity)
						return done_obj;
					} catch (error) {
						console.log("Object Generation Error, Check Parameters");
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



module.exports = router;