const MAXPLAYERS : number = 8; // Maximum number of player inputs per set
const INITPLAYERS : number = 2; // Initial number of player inputs
const MAXSETS : number = 100; // Maximum number of stored sets

// ----- Set form -----
function createPlayer(num: number) {
	// Creates input fields for a single player and adds them to set-form element

	let container = document.createElement('div');
	container.id = "p" + num;
	container.className = "player-container";

	let label = document.createElement('label');
	label.id = "p" + num + "-label";
	label.innerHTML = "Player " + num + ": ";

	let name = (<HTMLInputElement>document.createElement('INPUT'));
	name.id = "p" + num + "-name";
	name.placeholder = "Player Name";
	name.size = 12;

	let note = (<HTMLInputElement>document.createElement('INPUT'));
	note.id = "p" + num + "-note";
	note.placeholder = "Notes";
	note.size =24;

    let score = (<HTMLInputElement>document.createElement('INPUT'));
	score.id = "p" + num + "-score";
	score.type = "number";
	score.min = "0";
	score.size = 3;
	score.value = "0";

	container.appendChild(label);
	container.appendChild(name);
	container.appendChild(note);
	container.appendChild(score);

    document.getElementById("set-form").appendChild(container);
	nPlayers++;
}


function addPlayer() {
	// Reveals a single hidden player input

	if (nPlayers < MAXPLAYERS) {
		let player = "p" + (nPlayers + 1);
		document.getElementById(player).style.display = 'block';
		document.getElementById('remove-button').removeAttribute('disabled');
		nPlayers++;

		if (nPlayers == MAXPLAYERS) {
			document.getElementById('add-button').setAttribute('disabled', 'true');
		}
	}
}


function removePlayer() {
	// Hides a single player input

	if (nPlayers > 2) {
		let player = "p" + nPlayers;

		// Hide inputs and set values back to default
		document.getElementById(player).style.display = 'none';
		(<HTMLInputElement>document.getElementById(player + "-name")).value = '';
		(<HTMLInputElement>document.getElementById(player + "-note")).value = '';
		(<HTMLInputElement>document.getElementById(player + "-score")).value = '0';

		document.getElementById('add-button').removeAttribute('disabled');
		nPlayers--;

		if (nPlayers == 2) {
			document.getElementById("remove-button").setAttribute('disabled', 'true');
		}
	}
}


function setupPlayers() {
	// Creates all player inputs, hides down to initial number of players

	for (let i=1; i < MAXPLAYERS + 1; i++) {
		// Create all player inputs
		createPlayer(i);
	}

	while (nPlayers > INITPLAYERS) {
		// Hide down to initial players
		removePlayer();
	}
}


function clearFields() {
	// Clears all fields

	// Clear game name if no stored sets
	if (storedSets.length == 0) {
		(<HTMLInputElement>document.getElementById("game-name")).value = "";
	}

	// Always clear set notes
	(<HTMLInputElement>document.getElementById("set-notes")).value = "";

	// Clear all player fields (even hidden ones)
	for (let i=1; i < MAXPLAYERS+1; i++) {
		(<HTMLInputElement>document.getElementById("p" + i + "-name")).value = "";
		(<HTMLInputElement>document.getElementById("p" + i + "-note")).value = "";
		(<HTMLInputElement>document.getElementById("p" + i + "-score")).value = "0";
	}
}


// ----- Results -----
function clearResultsVars() {
	// Clears all vars used to store results data
	storedSets = [];
	playerData.clear();
}


function clearResultsColumn(results: HTMLElement) {
	// Clears all child elements from results column
	while (results.firstChild) {
		results.removeChild(results.lastChild);
	}
}


function populateResults(results: HTMLElement) {
	// Fills results column with stats
	let title = document.createElement('h2');
	title.innerHTML = "Results";
	results.appendChild(title);

	if (storedSets.length == 0) {
		let message = document.createElement('p');
		message.innerHTML = "NO SET DATA FOUND";
		results.appendChild(message);
	} else {
		// Put real results stuff here
	}
}


function updateResults() {
	// Updates results column
	let results = document.getElementById('results');
	clearResultsColumn(results);
	populateResults(results);
}


function storeSet() {
	// Builds and stores 1 set Map in storedSets array

	let setData = new Map();
	setData.set("gameName", (<HTMLInputElement>document.getElementById("game-name")).value);
	setData.set("setNote", (<HTMLInputElement>document.getElementById("set-notes")).value);

	// Build player array
	setData.set("playerName", []);
	setData.set("playerNote", []);
	setData.set("playerScore", []);

	for (let i=1; i<nPlayers+1; i++){
		setData.get("playerName").push((<HTMLInputElement>document.getElementById("p" + i + "-name")).value);
		setData.get("playerNote").push((<HTMLInputElement>document.getElementById("p" + i + "-note")).value);
		setData.get("playerScore").push((<HTMLInputElement>document.getElementById("p" + i + "-score")).value);
	}

	storedSets.push(setData);
}


function findWinners() {
	// Returns an array of players with the highest points (names are strings)
	let winners= [];
	let hiscore : number = 0;

	for (let i=1; i<nPlayers+1; i++) {
		let name = (<HTMLInputElement>document.getElementById("p" + i + "-name")).value
		let score = +(<HTMLInputElement>document.getElementById("p" + i + "-score")).value

		if (score > hiscore) {
			winners = [name];
			hiscore = score;
		} else if (score == hiscore) {
			winners.push(name)
		}
	}

	return winners;
}


function addPlayerWin() {
	// Stores a winner in playerData - add player to playerData first!
	let winners = findWinners();

	// Add wins
	for (let i=0; i<winners.length; i++) {
		playerData.get(winners[i])[0] += 1;
	}
}


function getTotalScore() {
	// Returns the total score from the board
	let totalScore : number = 0;
	for (let p=1; p<nPlayers+1; p++) {
		totalScore += +(<HTMLInputElement>document.getElementById("p" + p + "-score")).value;
	}

	return totalScore;
}


function playerCompare(player1, player2) {
	// Compare function sorting playerData map
	// inputs are playerData arrays of names + scores - [name, [setWins, setTotal, scoreEarned, scorePossible]]
	let p1 = player1[1];
	let p2 = player2[1];
	let setDifference = (p2[0] / p2[1]) - (p1[0] / p1[1]);

	if (!setDifference) {
		// Return difference based on points earned / points possible
		return (p2[2] / p2[3]) - (p1[2] / p1[3]);
	} else {
		// Return difference based on sets won / sets played
		return setDifference;
	}

}


function storePlayers() {
	// Maintains the playerData map - keys are player names, values are [setWins, setTotal, scoreEarned, scorePossible]
	for (let p=1; p<nPlayers+1; p++) {
		let name = (<HTMLInputElement>document.getElementById("p" + p + "-name")).value;
		let score : number = +(<HTMLInputElement>document.getElementById("p" + p + "-score")).value;
		let totalScore : number = getTotalScore();
		if (playerData.has(name)) {
			playerData.get(name)[1] += 1; // Add played set
			playerData.get(name)[2] += score; // Add earned score
			playerData.get(name)[3] += totalScore; // Add possible points

		} else {
			// Create the entry
			// setWins = 0, totalSets = 1, scoreTotal = score, scorePossible = total score
			playerData.set(name, [0, 1,  score, totalScore]);
		}
	}

	// Call other update functions
	addPlayerWin();

	// Sort playerData
	playerData = new Map([...playerData.entries()].sort(playerCompare));
}


function storeResults() {
	// Stores current set + players, then clears the forms
	storeSet();
	storePlayers();
	clearFields();
	updateResults();
	//console.log(playerData);
	//console.log(storedSets);

	// TODO - Enforce max sets
}


// ----- Navbar -----
function storeButton() {
	//Function for the "store" button
	if (window.confirm("Add current set to storage?")) {
		// TODO - front-end validation!!
		//	- Names can't be blank
		//	- Names can't be duplicated in a single set
		//	- Names will be case sensitiv
		//	- Scores must be positive
		//	- Lock game name field(?) + can't be blank
		//	- Lock add/remove player buttons
		storeResults();
	}
}


function clearButton() {
	// Function for "clear" button
	if (window.confirm("Clear all fields? Stored data will not be removed.")) {
		clearFields();
	}
}


function clearAllButton() {
	// Function for "clear all" button
	if (window.confirm("Clear all fields AND stored data? WARNING - this cannot be undone!")) {
		clearResultsVars();
		clearFields();
		updateResults();
	}
}



// ======= Setup =======
let nPlayers : number = 0; // Always-accurate number of players
let storedSets = []; // Array of maps, each map = 1 set
let playerData = new Map(); // Map of players, each value is [Sets Won, Points Earned]

setupPlayers();
updateResults();
