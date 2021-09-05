import { MAXPLAYERS, INITPLAYERS, VALIDATE_OUTLINE } from './constants.js';


let nPlayers = 0; // Always-accurate player count


export function getPlayerCount() {
	return nPlayers;
}


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


export function addPlayer() {
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


export function removePlayer() {
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


export function setupPlayers() {
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


export function clearFields(clearPlayers: boolean, clearGame: boolean) {
	// Clears all fields

	resetFields(); // Reset validation

	// Clear game name
	if (clearGame) {
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


export function resetFields() {
	// Resets all verified fields back to original state
	document.getElementById("game-name").style.outline = 'none';
	for (let i=1; i < nPlayers+1; i++) {
		document.getElementById("p" + i + "-name").style.outline = 'none';
	}
}

export function validateSet() {
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
