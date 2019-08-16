var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser').json();
var models = require('../utilities/registrationModels');
var events = require('../utilities/eventsMap');
var checksum = require('../checksum/checksum');
var qrcode = require('qrcode');
var uuidv1 = require('uuid/v1');
var pug = require('pug');
var path = require('path');
var nodemailer = require('nodemailer');

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

router.get('/:event', function (req, res) {
	var event = events[req.params.event];
	console.log(event);
	console.log(events);

	if (event.id in events) {
		res.render('registrations', {
			id: event.id,
			title: event.title,
			requiredSize: event.requiredSize,
			maxSize: event.maxSize,
			price: event.price
		});
	} else {
		console.log("Event doesn't exist");
		res.redirect('/events');
	}

});

router.post('/:event/register', function (req, res) {

	// Start the transaction based on the event

	var data = req.body;
	var event = events[req.params.event];
	var Model = models[event.id];
	var membersList = [];
	var transaction = {};

	for (var key in data) {
		if (key.includes('member-')) {
			membersList.push = data[key];
		}
	}

	// Create transaction packet for logging in Mongo

	transaction.teamName = data.name.replace(' ', '');
	transaction.size = data.size;
	transaction.email = data.email;
	transaction.leaderName = data.contactName;
	transaction.university = data.university;
	transaction.order_id = uuidv1();
	transaction.members = membersList;
	if (event.price == 0) {
		transaction.status = "CONFIRMED";
	} else {
		transaction.status = "PENDING";
	}

	if (event.id == 'expo') {
		transaction.projectTitle = data.projectTitle;
	}

	if (event.id == 'hackathon' || event.id == 'expo') {
		transaction.abstract = data.abstract;
	}

	Model.create(transaction, function (err, resp) {
		if (err) {
			console.log(err);
		} else {
			console.log(resp);
		}
	});

	// Create params for gateway (unnecessary for free events)

	if (event.price == 0) {
		// Confirm status and log it in MongoDB,
		// then render the response & send email
		qrcode.toDataURL({ 'order_id': transaction.order_id }, function (err, qr) {
			if (err) console.log(err);
			console.log(qr);
			var code = `<img src='${qr}'>`;
			var date = new Date();
			var date = date.toDateString();
			var locals = {
				order_id: transaction.order_id,
				amount: "Free",
				date: date,
				payment_method: "N/A",
				quantity: transaction.size,
				qrcode: code,
				event_date: event.date,
				itemline: event.title + " Registration",
				headline: "Registration Confirmed",
				title: "Ivarna | " + event.title + " Registration Confirmed"
			};
			var mailOptions = {
				from: 'ivarna@klh.edu.in',
				to: transaction.email,
				subject: 'Your registration is complete for ' + event.title,
				html: pug.renderFile(path.join(__dirname, '..', 'views', 'pay', 'receipt.pug'), locals)
			};

			transporter.sendMail(mailOptions).then(function (value) {
				console.log(value);
			}).catch(function (reason) {
				console.log(reason);
			});

			res.render('pay/receipt', locals);
		});
	} else {
		// Generate a checksum and hand off to frontend for redirection to payment gateway
		var key = "E7yyNS2mbS2SE2&r";
		var params = {};
		params['MID'] = "ZhCLfm38291372078650";
		params['WEBSITE'] = "DEFAULT";
		params['CHANNEL_ID'] = "WEB";
		params['INDUSTRY_TYPE_ID'] = "Retail";
		params['ORDER_ID'] = transaction.order_id;
		params['CUST_ID'] = data.email;
		params['TXN_AMOUNT'] = event.price;
		params['CALLBACK_URL'] = "https://ivarna.klh.edu.in/registrations/" + event.id + "/response";
		params['EMAIL'] = data.email;


		checksum.genchecksum(params, key, function (err, checksum) {
			if (err) console.log(err);
			params['CHECKSUMHASH'] = checksum;
			res.send(JSON.stringify(params));
		});
	}


});

router.post('/:event/response', function (req, res) {
	var event = req.params.event;
	var response = req.body;
	var Model = models[event];

	if (response.RESPCODE == 1) {
		Model.findOne({ order_id: response.ORDERID }, function (err, doc) {
			qrcode.toDataURL({ 'order_id': response.ORDERID }, function (err, qr) {
				if (err) console.log(err);
				var qrcode = `<img src='${qr}'>`;
				var locals = {
					order_id: response.ORDERID,
					amount: response.TXNAMOUNT,
					date: response.TXNDATE,
					payment_method: response.PAYMENTMODE,
					quantity: doc.size,
					qrcode: qrcode,
					event_date: events[event].date,
					itemline: events[event].title + " Registration",
					headline: "Registration Confirmed",
					title: "Ivarna | " + events[event].title + " Registration Confirmed"
				};
				var mailOptions = {
					from: 'ivarna@klh.edu.in',
					to: doc.email,
					subject: 'Your registration is complete for ' + events[event].title,
					html: pug.renderFile(path.join(__dirname, '..', 'views', 'pay', 'receipt.pug'), locals)
				};

				transporter.sendMail(mailOptions).then(function (value) {
					console.log(value);
				}).catch(function (reason) {
					console.log(reason);
				});

				res.render('pay/receipt', locals);
			});
		});
	} else {
		res.send("Transaction was unable to complete");
	}

});

module.exports = router;