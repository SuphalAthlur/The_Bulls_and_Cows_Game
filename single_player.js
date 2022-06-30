// Support variables declaration
let sys=[];
let sysDig=[[],[],[],[]];
let sysInd=0;
let sysNum=0;

// Provides status of the game
let turn=1;
let now="left";
let userQuery=[];

// Picks a number to play the game
function preCompute(){
	for (let i=1023; i<=9876; i++){
		let temp=i;
		let d=[];
		let alright=true;
		for (let j=0; j<4 && alright; j++){
			let hold=temp%10;
			temp-=hold;
			temp/=10;
			for (let k=0; k<d.length; k++){
				if (d[k]==hold){
					alright=false;
					break;
				}
			}
			d.push(hold);
		}
		if (alright){
			sys.push(i);
			for (let j=0; j<4; j++){
				sysDig[j].push(d[j]);
			}
		}
	}
	sysInd=Math.floor(Math.random()*10000000);
	sysInd%=sys.length;
	sysNum=sys[sysInd];
}

function forfeit(){
	let chk=document.querySelector("#userBox");
	if (chk!==null) chk.remove();
	failure();
}

function initiate(){
	document.querySelector("div.ready").remove();
	document.querySelector("body").innerHTML += `
		<div class="contain" style="padding: 40px; 0px;"></div>
		<div class="ready">
			<input type="button" value="Forfeit" id="begin" onclick="forfeit()">
		</div>
	`;
	preCompute();
	document.querySelector("div.contain").innerHTML = `
		<div class="sidebyside ${now}" id="userBox">
			<section class="resp p ${now}">
			<form onsubmit="return false;">
					<input type="reset" id="userReset" style="position: fixed; left: -200px; display: none;">
					<label for="userquery" id="labelQuery"><h2>Guess ${turn}:</h2></label><br>
					<input type="number" id="userquery" placeholder="Guess wise"><br>
					<input type="submit" id="submitButtonUser" value="Confirm" onclick="userResp()">
				</form>
			</section>
		</div>
	`;
	document.querySelector("#userquery").focus();
}

function winner (){
	document.querySelector("div.ready").innerHTML = `
		<div id="toss">
			<h1>Congrats!</h1>
			<h2>You took ${turn} turns</h2>
			<input type="button" class="inpBtn" value="Play Again!" onclick="reload()">
		</div>
	`;
	document.querySelector("body").innerHTML += `
		<footer>
			© Designed & Powered by<br><span>Suphal Athlur</span>
		</footer>
	`;
	document.querySelector("#toss .inpBtn").focus();
}

function failure (){
	let chk=document.querySelector("#userBox");
	if (chk!==null) chk.remove();
	document.querySelector("div.ready").innerHTML = `
		<div id="toss">
			<h1>Oops!</h1>
			<h2>You gave up in ${turn} turn(s)</h2>
			<input type="button" class="inpBtn" value="Play Again!" onclick="reload()">
		</div>
	`;
	document.querySelector("body").innerHTML += `
		<footer>
			© Designed & Powered by<br><span>Suphal Athlur</span>
		</footer>
	`;
	document.querySelector("#toss .inpBtn").focus();
}

function reload(){
	document.querySelector("#toss .inpBtn").focus();
}

function userResp (){
	// Read query from user
	let t=document.querySelector("#userquery").value;
	if (t===""){
		alert("Fill all required fields.");
		return;
	}
	let userNum=(Number)(t);
	let notokay=false;
	let temp=userNum;
	let userDig=[];
	if (userNum<1000 || userNum>10000) notokay=true;
	else{
		for (let j=0; j<4 && !notokay; j++){
			let hold=temp%10;
			temp-=hold;
			temp/=10;
			for (let k=0; k<userDig.length; k++){
				if (userDig[k]==hold){
					notokay=true;
					break;
				}
			}
			userDig.push(hold);
		}
	}
	if (notokay){
		alert ("Invalid Number. Enter 4 digit number with distinct digits and without leading zeroes.");
		document.querySelector("#userReset").click();
		return;
	}
	userQuery.push(userNum);

	// Generate the query result
	let retCows=0;
	let retBulls=0;
	for (let i=0; i<4; i++){
		for (let j=0; j<4; j++){
			if (sysDig[j][sysInd]==userDig[i]){
				if (i==j) retBulls++;
				else retCows++;
			}
		}
	}
	// Display the query result
	document.querySelector("#userBox").remove();
	document.querySelector("body div.contain").innerHTML += `
		<div class="sidebyside ${now}">
			<section class="resp p ${now}"><a>
				<h2><span>Guess ${turn}:</span> ${userNum}</h2><br>
				<div class="bullrep">Bulls: ${retBulls}</div>
				<div class="cowrep">Cows: ${retCows}</div>
			</a></section>
		</div>
	`;
	if (now==="right"){
		document.querySelector("body div.contain").innerHTML += "<br>";
		now="left";
	}
	else now="right";
	if (retBulls==4) winner();
	turn++;
	document.querySelector("body div.contain").innerHTML += `
		<div class="sidebyside ${now}" id="userBox">
			<section class="resp p ${now}">
				<form onsubmit="return false;">
					<input type="reset" id="userReset" style="position: fixed; left: -200px; display: none;">
					<label for="userquery" id="labelQuery"><h2>Guess ${turn}:</h2></label><br>
					<input type="number" id="userquery" required><br>
					<input type="submit" id="submitButtonUser" value="Confirm" onclick="userResp()">
				</form>
			</section>
		</div>
	`;
	document.querySelector("#userquery").focus();
}