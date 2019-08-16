var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser').json();
var models = require('../utilities/registrationModels');
var events = require('../utilities/eventsMap');

router.use(bodyParser);

router.get("/", function (req, res) {
	res.render("check", { title: "Ivarna | Check Registration" });
});

router.post("/check", function (req, res, next) {
	console.log(req.body);
	models[req.body.event].findOne({ email: req.body.email }, function(err, doc) {
		if (err) next(err);

		console.log(doc);
		
		if (doc) {
			console.log("true");
			res.send("true");
		} else {
			console.log('false');
			res.send(null);
		}
	});
});

module.exports = router;