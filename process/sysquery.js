module.exports = async function (uC,uB) {
	let userBulls=(Number)(uB);
	let userCows=(Number)(uC);
	let sysQDig=[];
	let ret = "";
	let ex = "";
	let alrtmsg = "";

	const { gameDeet, gameStat } = require ('../models/ongoing_game');
	let tmp1 = await gameDeet.find();
	let tmp2 = await gameStat.find();
	tmp1 = tmp1[0];
	tmp2 = tmp2[0];

	let temp=tmp2.sysQ;
	for (let j=0; j<4; j++){
		let hold=temp%10;
		temp-=hold;
		temp/=10;
		sysQDig.push(hold);
	}
	// document.querySelector("#sysBox").remove();
	ret += `
		<div class="sidebyside ${tmp1.system}">
			<section class="resp s ${tmp1.system}"><a>
				<h2><span>Guess ${tmp2.turn}:</span> ${tmp2.sysQ}</h2><br>
				<div class="bullrep">Bulls: ${userBulls}</div>
				<div class="cowrep">Cows: ${userCows}</div>
			</a></section>
		</div>
	`;
	if (tmp1.pFirst) ret += "<br>";
	// If game has ended
	let tmp2.validCount=0;
	for (let k=0; k<sys.length; k++){
		if (tmp2.valid[k]){
			let cows=0;
			let bulls=0;
			for (let i=0; i<4; i++){
				for (let j=0; j<4; j++){
					if (tmp1.sysDig[j][k]==sysQDig[i]){
						if (i==j) bulls++;
						else cows++;
					}
				}
			}
			if (cows!=userCows || bulls!=userBulls) tmp2.valid[k]=false;
			else tmp2.validCount++;
		}
	}
	// Alert user [YET]
	if (tmp2.validCount==0){
		alrtmsg = "Nonsense";
		tmp2.victor = 6;
		// confuser();
	}
	// update tmp2.validities
	else if (userBulls === 4){
		if (tmp1.pFirst){
			tmp2.victor = 5;
			alrtmsg = "If you do not get it now, system wins :)";
		}
		else{
			tmp2.victor = 3;
			alrtmsg = "Game ended!";
			// winner();
		}
	}
	else if (tmp2.victor === 4){
		tmp2.victor = 2;
		alrtmsg = "Game ended!";
		// winner();
	}
	if (tmp2.victor !== 2 && tmp2.victor !== 3 && tmp2.victor !== 6){
		if (tmp1.pFirst) tmp2.turn++;
		ex += `
			<div class="sidebyside ${tmp1.player}" id="userBox">
				<section class="resp p ${tmp1.player}">
					<form action="/system_player/game" method="POST">
						<input type="reset" id="userReset" style="position: fixed; left: -200px; display: none;">
						<label for="userquery" id="labelQuery"><h2>Guess ${tmp2.turn}:</h2></label><br>
						<input type="number" id="userquery" required><br>
						<input type="submit" id="submitButtonUser" value="Confirm">
					</form>
				</section>
			</div>
		`;
	}
	let sv = new gameStat ({
		sysQ: tmp2.sysQ,
		userQ: tmp2.userQ,
		valid: tmp2.valid,
		turn: tmp2.turn,
		victor: tmp2.victor
	});
	await gameStat.deleteMany();	
	await sv.save();
	return { del: "sysBox", alrtmsg: alrtmsg, htmlapd1: ret, htmlapd2: ex };
}