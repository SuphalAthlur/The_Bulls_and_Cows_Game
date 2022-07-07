module.exports = async function (t) {
	console.log("Kurama ",t);
	const { gameDeet, gameStat } = require ('../models/ongoing_game');
	let tmp1 = await gameDeet.find();
	let tmp2= await gameStat.find();
	tmp1 = tmp1[0];
	tmp2 = tmp2[0];
	let ret = "";
	let alrtmsg = "";
	let ex = "";

	let userNum=(Number)(t);
	tmp2.userQ = userNum;
	console.log (userNum, tmp2.userQ);

	let temp=userNum;
	let userDig=[];
	for (let j=0; j<4; j++){
		let hold=temp%10;
		temp-=hold;
		temp/=10;
		userDig.push(hold);
	}

	// Generate the query result
	let retCows = 0;
	let retBulls = 0;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (tmp1.sysDig[j][tmp1.sysInd] === userDig[i]) {
				if (i === j) retBulls++;
				else retCows++;
			}
		}
	}

	// Display the query result
	ret += `
		<div class="sidebyside ${tmp1.player}">
			<section class="resp p ${tmp1.player}"><a>
				<h2><span>Guess ${tmp2.turn}:</span> ${tmp2.userQ}</h2><br>
				<div class="bullrep">Bulls: ${retBulls}</div>
				<div class="cowrep">Cows: ${retCows}</div>
			</a></section>
		</div>
	`;
	if (!tmp1.pFirst) ret += "<br>";

	if (retBulls === 4) {
		if (tmp1.pFirst) {
			tmp2.victor = 4;
			alrtmsg = "If the system does not get it now, you win :)";
			// alert("If the system does not get it now, you win :)");
		}
		else {
			tmp2.victor = 2;
			alrtmsg = "Game ended!";
			// winner();
		}
	}
	else if (tmp2.victor === 5){
		tmp2.victor = 3;
		alrtmsg = "Game ended!";
		// winner();
	}

	if (tmp2.victor !== 2 && tmp2.victor !== 3) {
		if (!tmp1.pFirst) tmp2.turn ++;

		// Compute all frequencies
		let freq=[[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
			[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
			[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
			[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]]];

		for (let i=0; i<4536; i++){
			if (!tmp2.valid[i]) continue;
			for (let j=0; j<4; j++){
				freq[j][tmp1.sysDig[j][i]][1]++;
			}
		}

		// Sort all frequencies
		for (let i=0; i<4; i++){
			for (let j=0; j<10; j++){
				for (let k=0; k<9-j; k++){
					if (freq[i][k][1]>freq[i][k+1][1]){
						let c=freq[i][k][0];
						freq[i][k][0]=freq[i][k+1][0];
						freq[i][k+1][0]=c;
						c=freq[i][k][1];
						freq[i][k][1]=freq[i][k+1][1];
						freq[i][k+1][1]=c;
					}
				}
			}
		}

		// Construct query
		let temp=-1;
		for (let i=0; i<4536; i++){
			if (!tmp2.valid[i]) continue;
			let tmp=0;
			for (let j=0; j<4; j++){
				for (let k=0; k<10; k++){
					if (tmp1.sysDig[j][i]==freq[j][k][0]){
						tmp+=(k+1);
					}
				}
			}
			if (tmp>=temp){
				temp=tmp;
				tmp2.sysQ=tmp1.sys[i];
			}
		}

		// Send system query
		ex += `
			<div class="sidebyside ${tmp1.system}" id="sysBox">
				<section class="resp s ${tmp1.system}">
					<form onsubmit="return false;">
						<h2>Guess ${tmp2.turn}: ${tmp2.sysQ}</h2>
						<input type="reset" id="sysReset" style="position: fixed; left: -200px; display: none;">
						<label for="sysquerybulls" id="labelQuery2">Bulls: </label>
						<input type="number" id="sysquerybulls" required><br>
						<label for="sysquerycows" id="labelQuery1">Cows: </label>
						<input type="number" id="sysquerycows" required><br>
						<input type="submit" id="submitButtonSys" value="Confirm" onclick="sysResp()">
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

	return { del: "userBox", alrtmsg: alrtmsg, htmlapd1: ret, htmlapd2: ex }
}
