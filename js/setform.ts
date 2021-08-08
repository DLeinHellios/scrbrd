const maxPlayers = 8; // Max possible player slots per set
const initPlayers = 2; // Initial open player spots


function createPlayer(num: number) {
	var container = document.createElement('div');
	container.id = "p" + num;
	container.className = "player-container";

	var label = document.createElement('label');
	label.id = "p" + num + "-label";
	label.innerHTML = "Player " + num + ": ";

	var name = document.createElement('INPUT');
	name.id = "p" + num + "-name";
	name.setAttribute("placeholder", "Player Name");
	name.setAttribute("size", "12");

	var note = document.createElement('INPUT');
	note.id = "p" + num + "-note";
	note.setAttribute("placeholder", "Notes");
	note.setAttribute("size", "24");

    var score = document.createElement('INPUT');
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
	if (nPlayers < maxPlayers) {
		let player = "p" + (nPlayers + 1);
		document.getElementById(player).style.display = 'block';
		document.getElementById('remove-button').removeAttribute('disabled');
		nPlayers++;

		if (nPlayers == maxPlayers) {
			document.getElementById('add-button').setAttribute('disabled', 'true');
		}
	}
}


function removePlayer() {
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
	for (let i=1; i < maxPlayers + 1; i++) {
		// Create all player inputs
		createPlayer(i);
	}

	while (nPlayers > initPlayers) {
		// Hide down to initial players
		removePlayer();
	}
}


// ------- Setup -------
var nPlayers = 0;
setupPlayers();
