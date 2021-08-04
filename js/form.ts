const maxPlayers = 8;
var nPlayers = 8;

// TODO: Generate player forms for maxPlayers, hide down to nPlayers

function createPlayer() {
	var container = document.createElement('div');
	container.className = "player-container"

	var l = document.createElement('label');
	l.innerHTML = "Player #: ";

	var n = document.createElement('INPUT');
	n.setAttribute("size", "20");

    var s = document.createElement('INPUT');
	s.setAttribute("type", "number");
	s.setAttribute("min", "0");
	s.setAttribute("size", "3");
	s.setAttribute("value", "0");

	container.appendChild(l);
	container.appendChild(n);
	container.appendChild(s);

    document.getElementById("setForm").appendChild(container);
}


function addPlayer() {
	console.log(nPlayers);
	if (nPlayers < maxPlayers) {
		let player = "p" + (nPlayers + 1);
		document.getElementById(player).style.display = 'block';
		nPlayers++;

	// TODO - Disable button when players = maxPlayers - re-enable remove button on successful addition
	}
}


function removePlayer() {
	if (nPlayers > 2) {
		let player = "p" + nPlayers;
		document.getElementById(player).style.display = 'none';
		nPlayers--;

	// TODO - Disable button when players = 2 - re-enable add button on successful removal
	}

}
