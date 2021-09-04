// SetCount by DLeinHellios. Browser-based scoreboard and record keeper


const MAXPLAYERS : number = 8; // Maximum number of player inputs per set
const INITPLAYERS : number = 2; // Initial number of player inputs - Must be < max players!
const MAXSETS : number = 100; // Maximum number of stored sets
const MAX_NAME_LENGTH : number = 30; // Max number of characters in a player name field
const VALIDATE_OUTLINE : string = "2px solid #F10A0A"; // Style to apply to invalid form fields outline


interface Player {
	setWins: number;
	setTotal: number;
	scoreEarned: number;
	scoreTotal: number;
}

interface SetData {
	gameName: string;
	setNote: string;
	playerNames: string[];
	playerNotes: string[];
	playerScores: number[];
}


// ----- Set form -----
function createPlayer(num: number) {
	// Creates input fields for a single player and adds them to set-form element

	let container = document.createElement('div');
	container.id = "p" + num;
	container.className = "player-container";

	let label = document.createElement('label');
	label.id = "p" + num + "-label";
	label.innerText = "Player " + num + ": ";

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


function addFormListeners() {
	// Adds all nav listeners to buttons
	document.getElementById("add-button").addEventListener('click', () => {
		addPlayer();
	})

	document.getElementById("remove-button").addEventListener('click', () => {
		removePlayer();
	})
}


function clearFields(clearPlayers : boolean) {
	// Clears all fields

	resetFields(); // Reset validation

	// Clear game name if no stored sets
	if (storedSets.length == 0) {
		(<HTMLInputElement>document.getElementById("game-name")).value = "";
	}

	// Always clear set notes
	(<HTMLInputElement>document.getElementById("set-notes")).value = "";

	// Clear all player fields (even hidden ones)
	for (let i=1; i < MAXPLAYERS+1; i++) {
		if (clearPlayers) {
			(<HTMLInputElement>document.getElementById("p" + i + "-name")).value = "";
			(<HTMLInputElement>document.getElementById("p" + i + "-note")).value = "";
		}

		(<HTMLInputElement>document.getElementById("p" + i + "-score")).value = "0";
	}
}


// ----- Form Validation -----
function resetFields() {
	// Resets all verified fields back to original state
	document.getElementById("game-name").style.outline = 'none';
	for (let i=1; i < nPlayers+1; i++) {
		document.getElementById("p" + i + "-name").style.outline = 'none';
	}
}

function validateSet() {
	// Sets fields red, returns bool for valid/invalid
	let valid = true;
	let names : string[] = [];
	resetFields(); // Reset before validation


	// Game name cannot be blank
	if ((<HTMLInputElement>document.getElementById("game-name")).value == "") {
		document.getElementById("game-name").style.outline = VALIDATE_OUTLINE;
		valid = false;
	}

	// Active player names cannot be blank, must be unique
	for (let i=1; i < nPlayers+1; i++) {
		let name = (<HTMLInputElement>document.getElementById("p" + i + "-name")).value;
		if (name == '' || names.includes(name)) {
			document.getElementById("p" + i + "-name").style.outline = VALIDATE_OUTLINE;
			valid = false;
		} else if (name.length > 30) {
			document.getElementById("p" + i + "-name").style.outline = VALIDATE_OUTLINE;
			valid = false;
		} else {
			names.push(name);
		}
	}

	return valid;
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


function populateLeaderboard() {
	// Returns an HTML element for leaderboard text
	let leaderboard = document.createElement('div');
	leaderboard.className = "leaderboard";

	let title = document.createElement('h3');
	title.innerText = "Leaderboard";
	leaderboard.appendChild(title);

	let placeTable = document.createElement('table');


	let place = 1;
	for (const [name, stats] of playerData) {
		let playerRow = document.createElement('tr');
		let playerPlace = document.createElement('td');
		let playerName = document.createElement('td');
		let playerScore = document.createElement('td');

		playerName.innerText = name;
		playerScore.innerText = `${stats.setWins}-${stats.setTotal - stats.setWins}  (${stats.scoreEarned}-${stats.scoreTotal - stats.scoreEarned})`;
		playerPlace.innerText = place.toString() + '.';
		place++;

		playerRow.appendChild(playerPlace);
		playerRow.appendChild(playerName);
		playerRow.appendChild(playerScore);

		placeTable.appendChild(playerRow);
	}

	leaderboard.appendChild(placeTable);

	return leaderboard;

}


function populateResults(results: HTMLElement) {
	// Fills results column with stats
	if (storedSets.length == 0 && playerData.size == 0) {
		let message = document.createElement('p');
		message.innerText = "NO DATA FOUND";
		results.appendChild(message);
	} else {
		// Put real results stuff here
		results.appendChild(populateLeaderboard());
	}
}


function updateResults() {
	// Updates results column
	let results = document.getElementById('results');
	clearResultsColumn(results);
	populateResults(results);
}



// ----- Storage -----
function storeSet() {
	// Builds and stores 1 set Map in storedSets array

	// Build player arrays
	let playerNames = [];
	let playerNotes = [];
	let playerScores = [];

	for (let i=1; i<nPlayers+1; i++){
		playerNames.push((<HTMLInputElement>document.getElementById("p" + i + "-name")).value);
		playerNotes.push((<HTMLInputElement>document.getElementById("p" + i + "-note")).value);
		playerScores.push(+(<HTMLInputElement>document.getElementById("p" + i + "-score")).value);
	}

	// Build setData object
	let setData: SetData = {
		gameName: (<HTMLInputElement>document.getElementById("game-name")).value,
		setNote: (<HTMLInputElement>document.getElementById("set-notes")).value,
		playerNames: playerNames,
		playerNotes: playerNotes,
		playerScores: playerScores
	}

	// Push into set array
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
		playerData.get(winners[i]).setWins += 1;
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
	// inputs are playerData arrays of names + stats as Player interface
	let p1 = player1[1];
	let p2 = player2[1];
	let setDifference = (p2.setWins / p2.setTotal) - (p1.setWins / p1.setTotal);

	if (!setDifference) {
		// Return difference based on points earned / points possible
		return (p2.scoreEarned / p2.scoreTotal) - (p1.scoreEarned / p1.scoreTotal);
	} else {
		// Return difference based on sets won / sets played
		return setDifference;
	}

}


function storePlayers() {
	// Maintains the playerData map - keys are player names, values use Player interface
	for (let p=1; p<nPlayers+1; p++) {
		let name = (<HTMLInputElement>document.getElementById("p" + p + "-name")).value;
		let score : number = +(<HTMLInputElement>document.getElementById("p" + p + "-score")).value;
		let totalScore : number = getTotalScore();
		if (playerData.has(name)) {
			playerData.get(name).setTotal += 1; // Add played set
			playerData.get(name).scoreEarned += score; // Add earned score
			playerData.get(name).scoreTotal += totalScore; // Add possible points

		} else {
			// Create the entry
			let player: Player = {
				setWins: 0,
				setTotal: 1,
				scoreEarned: score,
				scoreTotal: totalScore
			}

			playerData.set(name, player);
		}
	}

	// Call other update functions
	addPlayerWin();

	// Sort playerData
	playerData = new Map([...playerData.entries()].sort(playerCompare));
}


function storeResults() {
	// Stores current set + players, then clears the forms
	if (validateSet()) {
		storeSet();
		storePlayers();
		clearFields(false);
		updateResults();
		console.log(playerData);
		console.log(storedSets);
	}
}


// ----- Navbar -----
function storeButton() {
	//Function for the "store" button
	if (storedSets.length < MAXSETS) {
		if (window.confirm("Add current set to storage?")) {
			storeResults();
		}
	} else {
		window.alert("Maximum number of sets reached! Please export your data and clear to continue");
	}
}


function clearButton() {
	// Function for "clear" button
	if (window.confirm("Clear fields? Stored data will not be removed.")) {
		clearFields(true);
	}
}


function clearAllButton() {
	// Function for "clear all" button
	if (window.confirm("Clear all fields AND stored data? WARNING - this cannot be undone!")) {
		clearResultsVars();
		clearFields(true);
		updateResults();
	}
}


function addNavListeners() {
	// Adds all nav listeners to buttons
	document.getElementById("nav-store").addEventListener('click', () => {
		storeButton();
	})

	document.getElementById("nav-clear").addEventListener('click', () => {
		clearButton();
	})

	document.getElementById("nav-clearall").addEventListener('click', () => {
		clearAllButton();
	})
}


// ======= Setup =======
let nPlayers : number = 0; // Always-accurate number of players
let storedSets = []; // Array of maps, each map = 1 set
let playerData = new Map(); // Map of Players, each value is [Sets Won, Points Earned]

setupPlayers();
updateResults();
addNavListeners();
addFormListeners();
