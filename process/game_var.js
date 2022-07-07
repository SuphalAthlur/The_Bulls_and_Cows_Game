module.exports = async function (coin) {
	const _ = require ('lodash');
	const mongoose = require ('mongoose');
	const { gameDeet, gameStat } = require ('../models/ongoing_game');

	// Support variables declaration
	let sys = [];
	let sysDig = [[],[],[],[]];
	let valid = [];
	let sysQ = -1;
	let userQ = -1;
	let pFirst = true;
	let player = "left";
	let system = "right";
	let sysInd = 0;
	let sysNum = 0;

	// Provides status of the game
	let victor = 0;
	let turn = 1;

	for (let i = 1023; i <= 9876; i++){
		let temp = i;
		let d = [];
		let alright = true;
		for (let j = 0; j < 4 && alright; j++){
			let hold = temp%10;
			temp -= hold;
			temp /= 10;
			for (let k = 0; k < d.length; k++){
				if (d[k] == hold){
					alright = false;
					break;
				}
			}
			d.push(hold);
		}
		if (alright){
			sys.push(i);
			valid.push(true);
			for (let j = 0; j < 4; j++){
				sysDig[j].push(d[j]);
			}
		}
	}

	// Allots a random number to the system
	sysInd = _.random(0,4535);;
	sysNum = sys[sysInd];

	// Toss it
	let cointossed = _.random(1,2);
	let ver = true;
	if (cointossed === 2) ver = false;
	if (ver !== coin){
		pFirst = false;
		player = "right";
		system = "left";
	}

	let pass1 = new gameDeet ({
	  sys: sys,
	  sysDig: sysDig,
	  pFirst: pFirst,
	  coin: coin,
	  verdict: ver,
	  player: player,
	  system: system,
	  sysInd: sysInd,
	  sysNum: sysNum
	});
	let pass2 = new gameStat ({
		sysQ: sysQ,
		userQ: userQ,
		valid: valid,
		turn: turn,
		victor: victor
	});
	await gameDeet.deleteMany();
	await pass1.save();
	await gameStat.deleteMany();
	await pass2.save();
	return 0;
}
