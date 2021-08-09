const MAXPLAYERS = 8;
const INITPLAYERS = 2;
const MAXSETS = 100;


function createPlayer(num: number) {
	// Creates input fields for a single player and adds them to set-form element

	let container = document.createElement('div');
	container.id = "p" + num;
	container.className = "player-container";

	let label = document.createElement('label');
	label.id = "p" + num + "-label";
	label.innerHTML = "Player " + num + ": ";

	let name = document.createElement('INPUT');
	name.id = "p" + num + "-name";
	name.setAttribute("placeholder", "Player Name");
	name.setAttribute("size", "12");

	let note = document.createElement('INPUT');
	note.id = "p" + num + "-note";
	note.setAttribute("placeholder", "Notes");
	note.setAttribute("size", "24");

    let score = document.createElement('INPUT');
	score.id = "p" + num + "-score";
	score.setAttribute("type", "number");
	score.setAttribute("min", "0");
	score.setAttribute("size", "3");
	score.setAttribute("value", "0");

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
		document.getElementById(player).style.display = 'none';
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


function updateResults() {
	// Updates results column - MOVE THIS
	if (storedSets.length == 0) {
		let message = document.createElement('p');
		message.innerHTML = "NO SET DATA FOUND";
		document.getElementById('results').appendChild(message);
	} else {
		console.log(storedSets);
	}
}


function clearFields() {
	// Clears all fields - MOVE
	if (window.confirm("Clear all fields? Stored data will not be removed.")) {
		console.log("yes");
	}
}


// ===== Setup ===
let nPlayers = 0;
let storedSets = [];


setupPlayers();
updateResults();
