var express = require('express');
var router = express.Router();
var events = require('../utilities/eventsMap');

router.get('/', function (req, res, next) {
	res.render('index', { title: 'Ivarna | Home' });
});

router.get('/contact', function (req, res) {
	res.render('contact', { title: 'Ivarna | Contact Us' })
});

router.get('/events', function (req, res) {
	res.render('events', { title: 'Ivarna | Events', events: events });
});

router.get('/edmnight', function (req, res) {
	res.render('edmnight', { title: 'Ivarna | EDM Night' });
});

router.get('/sponsors', function (req, res) {
	res.render('sponsors', { title: 'Ivarna | Sponsors' });
});

module.exports = router;
