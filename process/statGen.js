module.exports = async function (user_id) {
	const mongoose = require ('mongoose');
	const games = require ('../models/game');

	const alluserdat = await games.find({user: user_id});
	let t_avg = 0;
	let tgame_avg = 0;
	let wins = 0;
	let loss = 0;
	let tot_games = 0;
	let tot_turns = 0;

	alluserdat.forEach((g) => {
		if (g.victor !== "System") wins++;
		else loss++;
		t_avg += (g.average_time) * (g.turns);
		tot_turns += g.turns;
		tgame_avg += g.total_time;
		tot_games++;
	});
	tgame_avg /= tot_games;
	t_avg /= tot_turns;

	return {wins: wins ,loss: loss , t_avg: t_avg, tgame_avg: tgame_avg};
}