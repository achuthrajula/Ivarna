var mongoose = require('mongoose');

var hackathonSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	university: String,
	members: [ String ],
	abstract: String
});

var codingCompetitionSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	university: String,
	members: [ String ]
});

var rcSportsSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	phone: String,
	members: [ String ]
});

var droneRaceSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	phone: String,
	members: [ String ]
});

var pubgSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	phone: String,
	members: [ String ]
});

var csGameSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	phone: String,
	members: [ String ]
})

var projectExpoSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	phone: String,
	members: [ String ],
	abstract: String,
	projectTitle: String
});

var adZapSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	phone: String,
	members: [ String ]
});

var managerSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	name: String,
	email: String,
	phone: String,
});

var roadiesSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	phone: String,
	members: [ String ]
});

var espritSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	phone: String,
	members: [ String ]
});
var contrarianSchema = new mongoose.Schema({
	status: String,
	order_id: String,
	teamName: String,
	size: Number,
	leaderName: String,
	email: String,
	phone: String,
	members: [ String ]
});

module.exports = {
	hackathon: mongoose.model("HackathonModel", hackathonSchema, "hackathon"),
	expo: mongoose.model("ExpoModel", projectExpoSchema, "expo"),
	counterstrike: mongoose.model('CounterStrikeModel', csGameSchema, "counterStrike"),
	pubg: mongoose.model('PubgModel', pubgSchema, 'pubg'),
	drone: mongoose.model('DroneRaceModel', droneRaceSchema, 'droneRaces'),
	landcircuit: mongoose.model('LandCircuitModel', rcSportsSchema, 'landCircuitRaces'),
	coding: mongoose.model('CodingCompetitionModel', codingCompetitionSchema, 'codingCompetition'),
	adzap: mongoose.model('AdZapModel', adZapSchema, 'adZap'),
	contrarian: mongoose.model('ContrarianModel', contrarianSchema, 'contrarians'),
	roadies: mongoose.model('RoadiesModel', roadiesSchema, 'roadies'),
	manager: mongoose.model('ManagerModel', managerSchema, 'managers'),
	esprit: mongoose.model('EspritModel', espritSchema, 'esprit')
};

