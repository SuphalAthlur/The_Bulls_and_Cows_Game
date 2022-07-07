// Support variables declaration
let sys=[];
let sysDig=[[],[],[],[]];
let valid=[];
let sysQ=0;
let pFirst=true;
let player="left";
let system="right";
let sysInd=0;
let sysNum=0;

// Provides status of the game
let victor=0;
let turn=1;
let sysQuery=[];
let userQuery=[];

// Generates the sample space
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
			valid.push(true);
			for (let j=0; j<4; j++){
				sysDig[j].push(d[j]);
			}
		}
	}
	// Allots a random number to the system
	sysInd=Math.floor(Math.random()*10000000);
	sysInd%=sys.length;
	sysNum=sys[sysInd];
}

function begintoss(){
	document.querySelector("div.ready").innerHTML = `
		<div id="toss">
			<h1>Call!</h1>
			<h2>Winner goes first</h2>
			<input type="button" class="inpBtn" value="Heads" onclick="toss('Heads')">
			<input type="button" class="inpBtn" value="Tails" onclick="toss('Tails')">
		</div>
	`;
}

function toss(choice){
	let coin=Math.floor((Math.random()*10000000))%2;
	let verdict="Heads";
	if (coin==1) verdict="Tails";
	document.querySelector("#toss").remove();
	if (verdict!==choice){
		pFirst=false;
		player="right";
		system="left";
	}
	document.querySelector("div.ready").innerHTML += `
		<div id="toss">
			<h2>You have chosen ${choice}</h2>
			<h1>It's ${verdict}!</h1>
			<input type="button" class="inpBtn" onclick="numberPick()" value="Proceed">
		</div>
	`;
}

function numberPick(){
	document.querySelector("#toss").remove();
	document.querySelector("div.ready").innerHTML += `
		<div id="toss">
			<h1>Pick a number</h1>
			<h2>with 4 distinct digits</h2>
			<input type="button" class="inpBtn" onclick="initiate()" value="Ready">
		</div>
	`;
}

function forfeit(){
	victor=3;
	console.log("Safely made it!");
	let clr=document.querySelector("#userBox");
	if (clr===null) clr=document.querySelector("#sysBox");
	if (clr!==null) clr.remove();
	winner();
}

function winner(){
	let champ1="You win!";
	let champ2="Congrats";
	if (victor===3){
		champ1="System wins!"
		champ2=`The number was ${sysNum}`;
	}
	document.querySelector("div.ready").innerHTML = `
		<div id="toss">
			<h1>${champ1}</h1>
			<h2>${champ2}</h2>
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

function confuser(){
	document.querySelector("div.ready").innerHTML = `
		<div id="toss">
			<h1>Dummy</h1>
			<h2>Your data is inconsistent</h2>
			<input type="button" class="inpBtn" value="Play Again!" onclick="reload()">
		</toss>
	`;
	document.querySelector("#toss .inpBtn").focus();
}

function reload(){
	document.querySelector(".inFocus").click();
}

function initiate(){
	document.querySelector("#toss").remove();
	preCompute();
	let leftName="YOU";
	let rightName="SYSTEM";
	let leftAbv="p";
	let rightAbv="s";
	if (!pFirst){
		let shift=leftName;
		leftName=rightName;
		rightName=shift;
		shift=leftAbv;
		leftAbv=rightAbv;
		rightAbv=shift;
	}
	document.querySelector("div.ready").remove();
	document.querySelector("body").innerHTML += `
		<div class="contain"></div>
		<div class="ready">
			<input type="button" value="Forfeit" id="begin" onclick="forfeit()">
		</div>
	`;
	document.querySelector("div.contain").innerHTML += `
		<div class="upHeading">
			<div class="sidebyside left">
				<section class="resp ${leftAbv} left heading">
					<h2>${leftName}</h2>
				</section>
			</div>
			<div class="sidebyside right">
				<section class="resp ${rightAbv} right heading">
					<h2>${rightName}</h2>
				</section>
			</div>
		</div><br>
	`;
	if (pFirst) {
		document.querySelector("div.contain").innerHTML += `
			<div class="sidebyside ${player}" id="userBox">
				<section class="resp p ${player}">
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
	else sysThink();
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
		<div class="sidebyside ${player}">
			<section class="resp p ${player}"><a>
				<h2><span>Guess ${turn}:</span> ${userNum}</h2><br>
				<div class="bullrep">Bulls: ${retBulls}</div>
				<div class="cowrep">Cows: ${retCows}</div>
			</a></section>
		</div>
	`;
	if (!pFirst) document.querySelector("body div.contain").innerHTML += "<br>";
	if (retBulls==4){
		if (pFirst){
			victor=4;
			alert("If the system does not get it now, you win :)");
		}
		else{
			victor=2;
			alert("Game ended!");
			winner();
		}
	}
	else if (victor==5){
		victor=3;
		alert("Game ended!");
		winner();
	}
	if (!pFirst) turn++;
	sysThink();
}

function sysThink()
{
	// Produce system query
	if (turn==1){
		let ind=Math.floor(Math.random()*10000000);
		ind%=sys.length;
		sysQ=sys[ind];
	}
	else{
		// Compute all frequencies
		let freq=[[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
			[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
			[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
			[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]]];
		for (let i=0; i<sys.length; i++){
			if (!valid[i]) continue;
			for (let j=0; j<4; j++){
				freq[j][sysDig[j][i]][1]++;
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
		for (let i=0; i<sys.length; i++){
			if (!valid[i]) continue;
			let tmp=0;
			for (let j=0; j<4; j++){
				for (let k=0; k<10; k++){
					if (sysDig[j][i]==freq[j][k][0]){
						tmp+=(k+1);
					}
				}
			}
			if (tmp>=temp){
				temp=tmp;
				sysQ=sys[i];
			}
		}
	}
	sysQuery.push(sysQ);
	// Fetch user response
	document.querySelector("body div.contain").innerHTML += `
		<div class="sidebyside ${system}" id="sysBox">
			<section class="resp s ${system}">
				<form onsubmit="return false">
					<h2>Guess ${turn}: ${sysQ}</h2>
					<input type="reset" id="sysReset" style="position: fixed; left: -200px; display: none;">
					<div>
					<label for="sysquerybulls" id="labelQuery2">Bulls: </label>
					<input type="number" id="sysquerybulls" required><br>
					<label for="sysquerycows" id="labelQuery1">Cows: </label>
					<input type="number" id="sysquerycows" required><br>
					<input type="submit" id="submitButtonSys" value="Confirm" onclick="sysResp()">
				</form>
			</section>
		</div>
	`;
	document.querySelector("#sysquerybulls").focus();
}

function sysResp()
{
	let uB=document.querySelector("#sysquerybulls").value;
	let uC=document.querySelector("#sysquerycows").value;
	if (uB==="" || uC===""){
		alert("Fill all required fields :)");
		return;
	}
	let userBulls=(Number)(uB);
	let userCows=(Number)(uC);
	if (userBulls + userCows > 4 || (userBulls == 3 && userCows == 1) || userCows<0 || userBulls<0){
		alert ("Invalid value. Recheck and try again.");
		document.querySelector("#sysReset").click();
		return;	
	}
	let sysQDig=[];
	let temp=sysQ;
	for (let j=0; j<4; j++){
		let hold=temp%10;
		temp-=hold;
		temp/=10;
		sysQDig.push(hold);
	}
	document.querySelector("#sysBox").remove();
	document.querySelector("body div.contain").innerHTML += `
		<div class="sidebyside ${system}">
			<section class="resp s ${system}"><a>
				<h2><span>Guess ${turn}:</span> ${sysQ}</h2><br>
				<div class="bullrep">Bulls: ${userBulls}</div>
				<div class="cowrep">Cows: ${userCows}</div>
			</a></section>
		</div>
	`;
	if (pFirst) document.querySelector("body div.contain").innerHTML += "<br>";
	// If game has ended
	let validCount=0;
	for (let k=0; k<sys.length; k++){
		if (valid[k]){
			let cows=0;
			let bulls=0;
			for (let i=0; i<4; i++){
				for (let j=0; j<4; j++){
					if (sysDig[j][k]==sysQDig[i]){
						if (i==j) bulls++;
						else cows++;
					}
				}
			}
			if (cows!=userCows || bulls!=userBulls) valid[k]=false;
			else validCount++;
		}
	}
	// Alert user [YET]
	if (validCount==0){
		alert('Nonsense');
		victor=6;
		confuser();
	}
	// update validities
	if (userBulls==4){
		if (pFirst){
			victor=5;
			alert("If you do not get it now, system wins :)");
		}
		else{		
			victor=3;
			alert("Game ended!");
			winner();
		}
	}
	else if (victor==4){
		victor=2;
		alert("Game ended!");
		winner();
	}
	if (victor==0){
		if (pFirst) turn++;
		document.querySelector("body div.contain").innerHTML += `
			<div class="sidebyside ${player}" id="userBox">
				<section class="resp p ${player}">
					<form onsubmit="return false;">
						<input type="reset" id="userReset" style="position: fixed; left: -200px; display: none;">
						<label for="userquery" id="labelQuery"><h2>Guess ${turn}:</h2></label><br>
						<input type="number" id="userquery" required><br>
						<input type="submit" id="submitButtonUser" value="Confirm" onclick="userResp()">
					</form>
				</section>
			</div>
		`;
	}
	document.querySelector("#userquery").focus();
	return;
}