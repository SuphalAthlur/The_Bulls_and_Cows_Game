const express = require ('express');
const mongoose = require ('mongoose');
const _ = require ('lodash');
const Game = require ('../models/game');
const { gameDeet, gameStat, sysQuery, userQuery } = require ('../models/ongoing_game');
let router = express.Router();


// router.get('/', (req,res) => {
// 	gameStat.deleteMany()
// 		.then( () => {
// 			gameDeet.deleteMany()
// 				.then ( () => {
// 					console.log ("Deleted!");
// 				});
// 		});
// });

router.get('/', (req,res) => {
	res.render ('system_player');
});

router.get('/toss', (req,res) => {
	res.render ('toss');
});

router.post('/toss', async (req,res) => {
	await require ('../process/game_var')(true);
	res.json ({ redirect: '/system_player/toss_result' });
});

router.put('/toss', async (req,res) => {
	await require ('../process/game_var')(false);
	res.json ({ redirect: '/system_player/toss_result' });
});

router.get('/toss_result', async (req,res) => {
	gameDeet.find().sort({ createdAt: 1 })
		.then ((result) => {
			let took = "Heads";
			let outcome = "Heads";
			if (result[0].coin === false) {
				took="Tails";
			}
			if (result[0].verdict === false) {
				outcome="Tails";
			}
			res.render ('toss_result', {took: took, outcome: outcome});
		})
		.catch ((e) => console.log (e));
});

router.post('/toss_result', (req,res) => {
	res.json ({ redirect: '/system_player/begin' });
});

router.get('/begin', (req,res) => {
	res.render ('begin');
});

router.post('/begin', (req,res) => {
	res.json ({ redirect: '/system_player/game' });
});

router.get('/game', async (req,res) => {
	console.log("Request received");
	let pass = await require ('../process/game_begin')();
	res.render ('game', pass);
});

router.post('/game', async (req,res) => {
	console.log(req)
	if (req.body.hasOwnProperty('sysquerycows')) {
		// let icheck = require ('../process/syscheck')(req.body.sysquerycows,req.body.sysquerybulls);
		// if (icheck !== "") res.json ({ msgdis: icheck });
		let info = await require ('../process/sysquery')(req.body.sysquerycows,req.body.sysquerybulls);
		res.json (info);
	}
	else {
		// let icheck = require ('../process/syscheck')(req.body.userquery);
		// if (icheck !== "") res.json ({ msgdis: icheck });
		console.log("In the controller ",req.body);
		let info = await require ('../process/userquery')(req.body.userquery);
		console.log("Received process output");
		res.json (info);
	}
});

module.exports = router;


// let rqd = {victor: "You", turns: 8};
// const tbadded = new Game (rqd);

// console.log(typeof req);
// Game.deleteMany()
// 	.then(() => {console.log("init");});

// tbadded.save()
// 	.then(result => {
//     	res.json({ redirect: '/home' });
//     })
//     .catch(err => {
//     	console.log(err);
//     });

// Game.findOneAndUpdate({victor: "You"},{victor: "Me"},{new: true})
// 	.then ((err) => console.log("Success!");
		
// const obj = require ('../process/game_var',{coin: true});
// Feed obj to mongodb and operate on the promise
// res.json({obj.pFirst});
// res.redirect('/toss/result');


// let rqd = {victor: "You", turns: 8};
// const tbadded = new Game (rqd);
// console.log("init");
// tbadded.save()
// 	.then(result => {
//     	res.json({ redirect: '/home' });
//     })
//     .catch(err => {
//     	console.log(err);
//     });

// const obj = require ('../process/game_var',{coin: false});
// Feed obj to mongodb and operate on the promise
// res.json({obj.pFirst});
// res.redirect('/toss/result');