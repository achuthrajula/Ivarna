var express = require('express');
var checksum = require('../checksum/checksum');
var uuidv1 = require('uuid/v1');
var bodyParser = require('body-parser').json();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var pug = require('pug');
var path = require('path');
var qrcode = require('qrcode');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	requireTLS: true,
	auth: {
		user: 'ivarna@klh.edu.in',
		pass: 'Ivarna@123'
	}
});

var edmSchema = new mongoose.Schema({
	order_id: String,
	name: String,
	email: String,
	phone: Number,
	amount: Number,
	numPasses: Number,
	passType: String,
	passes: [{ firstName: String, lastName: String }],
	status: String
});
var EdmPass = mongoose.model("EdmPass", edmSchema, "edmpasses");

var router = express.Router();
router.use(bodyParser);

router.get('/', function (req, res) {
	res.render('pay/checkout', { title: "Ivarna | Checkout" });
})

router.post('/checkout', function (req, res) {
	var data = req.body;
	var transaction = {};
	var names = [];
	var name = {};
	var amount;

	console.log(data);
	
	amount = data.numPasses * 500;

	for (var key in data) {
		if (key.includes('firstName-')) {
			name.firstName = data[key];
		}
		if (key.includes('lastName-')) {
			name.lastName = data[key];
			names.push(name);
		}
	}

	transaction.name = data.firstName.replace(' ', '') + ' ' + data.lastName.replace(' ', '');
	transaction.phone = data.phone;
	transaction.email = data.email;
	transaction.passType = data.passType;
	transaction.amount = amount;
	transaction.status = "PENDING";
	transaction.order_id = uuidv1();
	transaction.numPasses = data.numPasses;
	transaction.passes = names;

	EdmPass.create(transaction, function (err, resp) {
		if (err) console.log(err);
		else console.log(resp);
	});

	// Checking the amount
	// Make sure to get the amount again server side
	// based on the number of passes in formData
	// In the DB, delete from the last however many get mismatched
	// Check in the CB url too if the amount is matching the number
	// of passes for extra security.

	for (key in data) {
		console.log(key + " -> " + data[key]);
	}

	var key = "E7yyNS2mbS2SE2&r";
	var params = {};
	params['MID'] = "ZhCLfm38291372078650";
	params['WEBSITE'] = "DEFAULT";
	params['CHANNEL_ID'] = "WEB";
	params['INDUSTRY_TYPE_ID'] = "Retail";
	params['ORDER_ID'] = transaction.order_id;
	params['CUST_ID'] = data.email;
	params['TXN_AMOUNT'] = transaction.amount;
	params['CALLBACK_URL'] = "https://ivarna.herokuapp.com/pay/response";
	params['EMAIL'] = data.email;
	params['MOBILE_NO'] = data.phone;

	console.log(params);

	checksum.genchecksum(params, key, function (err, checksum) {
		if (err) console.log(err);
		params['CHECKSUMHASH'] = checksum;
		res.send(JSON.stringify(params));
	});

});

router.post('/response', function (req, res) {

	var response = req.body;

	console.log(response.RESPCODE);
	console.log(response);

	if (response.RESPCODE == 1) {
		EdmPass.update({ 'order_id': response.ORDERID }, { $set: { 'status': 'CONFIRMED' } }).exec();

		EdmPass.findOne({ order_id: response.ORDERID }, function (err, doc) {
			qrcode.toDataURL(response.ORDERID, function (err, qr) {
				var code = `<img src='${qr}'>`;
				var locals = {
					order_id: response.ORDERID,
					amount: response.TXNAMOUNT,
					date: response.TXNDATE,
					payment_method: response.PAYMENTMODE,
					quantity: doc.numPasses,
					event_date: "March 16, 2019",
					itemline: "EDM Passes",
					headline: "Passes Confirmed",
					qrcode: code,
					title: "Ivarna | EDM Passes Confirmed"
				};
				var mailOptions = {
					from: 'ivarna@klh.edu.in', // sender address
					to: doc.email, // list of receivers
					subject: 'Your EDM passes are confirmed!', // Subject line
					html: pug.renderFile(path.join(__dirname, '..', 'views', 'pay', 'receipt.pug'), locals)
				};

				transporter.sendMail(mailOptions).then(function (value) {
					console.log(value);
				}).catch(function (reason) {
					console.log(reason);
				})
				res.render('pay/receipt', locals);
			});
		});

	} else {
		EdmPass.deleteOne({ order_id: response.order_id });
		res.send("Transaction was unable to complete");
	}

});

// Testing route
router.get('/test', function (req, res) {
	var order_id = "81e4d040-3482-11e9-9805-3d3aeedb140c";
	run(res).catch(error => console.error(error.stack));

	async function run(response) {
		const res = await qrcode.toDataURL(order_id);
		var tag = `<img src='${res}'>`;
		response.send(tag);
	}
})

module.exports = router;
