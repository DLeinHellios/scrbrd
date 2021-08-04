
function addPlayer() {
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

for(let i=0; i<8; i++) {
	addPlayer();

}
