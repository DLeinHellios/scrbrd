import { SetData, Player } from './constants.js';
import { getCurrentDate } from './storage.js';


function findMostPlayers(storedSets : SetData[]) {
	// Returns the most players in a single set
	let playerCount = 2;

	for (let s of storedSets) {
		if (s.playerNames.length > playerCount) {
			playerCount = s.playerNames.length;
		}
	}

	return playerCount;
}


export function exportSetData(storedSets: SetData[]) {
	const maxPlayerCount = findMostPlayers(storedSets);

	// Build header
	let header = "gameName,setNote,date";
	for (let p=0; p<maxPlayerCount; p++) {
		header += `,p${p+1}Name,p${p+1}Note,p${p+1}Score`
	}

	header += "\n";

	// Build data
	let data = '';

	for (let s of storedSets) {
		let line = `${s.gameName},${s.setNote},${s.date}`;

		for (let p=0; p<s.playerNames.length; p++) {
			line += `,${s.playerNames[p]},${s.playerNotes[p]},${s.playerScores[p]}`;
		}

		// Pad out columns
		line += (',,,'.repeat(maxPlayerCount - s.playerNames.length));

		data += line + "\n";
	}

	// Ship it
	let hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(header + data);
	hiddenElement.target = '_blank';
	hiddenElement.download = `setCount_setData_${getCurrentDate()}.csv`;
	hiddenElement.click();
}


export function exportPlayerData(playerData: Map<string, Player>) {
	const header = "rank, playerName, setWins, setTotal, scoreEarned, scoreTotal\n";
	let data = "";
	let rank = 1;

	for (let player of playerData.entries()) {
		data += `${rank},${player[0]},${player[1].setWins},${player[1].setTotal},${player[1].scoreEarned},${player[1].scoreTotal}\n`
		rank++;
	}

	let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(header + data);
    hiddenElement.target = '_blank';
    hiddenElement.download = `setCount_playerData_${getCurrentDate()}.csv`;
    hiddenElement.click();
}
