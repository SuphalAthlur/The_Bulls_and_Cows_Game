// Support variables declaration
let sys=[];
let sysDig=[[],[],[],[]];
let valid=[];
let sysQ=0;

// Provides status of the game
let victor=0;
let turn=1;
let sysQuery=[];
let userQuery=[];

// Event listeners
// let sysWatcher=document.getElementById("submitButtonSys");
// if (sysWatcher) sysWatcher.addEventListener("click", function (event) {
// 	event.preventDefault();
// });
// let userWatcher=document.getElementById("submitButtonUser");
// if (userWatcher) userWatcher.addEventListener("click", function (event) {
// 	event.preventDefault();
// });

// Generates the sample space 
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
let sysInd=Math.floor(Math.random()*10000000);
sysInd%=sys.length;
let sysNum=sys[sysInd];

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
	document.querySelector("body div.contain").innerHTML += `<section class="resp p"><a>
		<h2><span>Guess ${turn}:</span> ${userNum}</h2><br>
		<div class="bullrep">Bulls: ${retBulls}</div>
		<div class="cowrep">Cows: ${retCows}</div>
	</a></section>`;
	if (retBulls==4){
		alert("You seem to have guessed the number. It is the system's turn now.");
		victor++;
	}

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
	document.querySelector("body div.contain").innerHTML += `<section id="sysBox" class="resp s">
		<form onsubmit="return false;">
			<h2>Guess ${turn}: ${sysQ}</h2>
			<input type="reset" id="sysReset" style="position: fixed; left: -200px; display: none;">
			<label for="sysquerybulls" id="labelQuery2">Bulls: </label>
			<input type="number" id="sysquerybulls" required><br>
			<label for="sysquerycows" id="labelQuery1">Cows: </label>
			<input type="number" id="sysquerycows" required><br>
			<input type="submit" id="submitButtonSys" value="Confirm" onclick="sysResp()">
		</form>
	</section>`;
	return;
}

function sysResp()
{
	let uB=document.querySelector("#sysquerybulls").value;
	let uC=document.querySelector("#sysquerycows").value;
	if (uB==="" || uC===""){
		alert("Fill all required fields.");
		return;
	}
	let userBulls=(Number)(uB);
	let userCows=(Number)(uC);
	if (userBulls + userCows > 4 || (userBulls == 3 && userCows == 1) || userCows<0 || userBulls<0){
		alert ("Invalid value. Recheck and try again.");
		document.querySelector("#sysReset").click();
		return;	
	}
	if (userBulls==4){
		alert ("You lose. Better luck next time :)");
		victor++;
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
	document.querySelector("body div.contain").innerHTML += `<section class="resp s"><a>
		<h2><span>Guess ${turn}:</span> ${sysQ}</h2><br>
		<div class="bullrep">Bulls: ${userBulls}</div>
		<div class="cowrep">Cows: ${userCows}</div>
	</a></section><br>`;
	// update validities
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
		victor++;
	}
	if (victor==0)
		document.querySelector("body div.contain").innerHTML += `<section id="userBox" class="resp p">
		<form onsubmit="return false;">
			<input type="reset" id="userReset" style="position: fixed; left: -200px; display: none;">
			<label for="userquery" id="labelQuery">Provide Query</label><br>
			<input type="number" id="userquery" required><br>
			<input type="submit" id="submitButtonUser" value="Confirm" onclick="userResp()">
		</form>
	</section>`;
	turn++;
	return;
}