module.exports = async function () {
	const _ = require ('lodash');
	const { gameDeet, gameStat } = require ('../models/ongoing_game');
	let tmp1 = await gameDeet.find();
	let tmp2 = await gameStat.find();
	tmp1 = tmp1[0];
	tmp2 = tmp2[0];
	console.log(tmp2);
	let leftName = "YOU";
	let rightName = "SYSTEM";
	let leftAbv = "p";
	let rightAbv = "s";
	let injectedContent = "";

	if (!tmp1.pFirst){
		console.log("In the segment");
		let shift = leftName;
		leftName = rightName;
		rightName = shift;
		shift = leftAbv;
		leftAbv = rightAbv;
		rightAbv = shift;
		console.log("In the segmen");
		let ind = _.random(0,4535);
		console.log("In the segme");
		tmp2.sysQ = (tmp1.sys)[ind];
		console.log("In the segm");
		await gameStat.deleteMany();
		console.log("In the seg");
		let sv = new gameStat ({
			sysQ: tmp2.sysQ,
			userQ: tmp2.userQ,
			valid: tmp2.valid,
			turn: tmp2.turn,
			victor: tmp2.victor
		});
		console.log("In the se");
		await sv.save();
		console.log("In the s");
	}

	return { leftName, rightName, leftAbv, rightAbv, pFirst: tmp1.pFirst,
		player: tmp1.player, system: tmp1.system, sysQ: tmp2.sysQ, turn: tmp2.turn };
}