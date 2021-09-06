import { Player, SetData } from './constants.js';
import { getPlayerCount, clearFields, validateSet } from './form.js';


let storedSets = []; // Array of maps, each map = 1 set
let playerData = new Map(); // Map of Players, each value is [Sets Won, Points Earned]


export function getPlayerData() {
	return playerData;
}

export function getSetData() {
	return storedSets;
}


export function getCurrentDate() {
	// Return the current date as string yyyy-mm-dd
	let today = new Date();

	return `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`;
}


// ----- Results Column -----
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


export function updateResults() {
	// Updates results column
	let results = document.getElementById('results');
	clearResultsColumn(results);
	populateResults(results);
}


// ----- Data Storage -----
function storeSet() {
	// Builds and stores 1 set Map in storedSets array

	// Build player arrays
	let playerNames = [];
	let playerNotes = [];
	let playerScores = [];

	for (let i=1; i<getPlayerCount()+1; i++){
		playerNames.push((<HTMLInputElement>document.getElementById("p" + i + "-name")).value);
		playerNotes.push((<HTMLInputElement>document.getElementById("p" + i + "-note")).value);
		playerScores.push(+(<HTMLInputElement>document.getElementById("p" + i + "-score")).value);
	}

	// Build setData object
	let setData: SetData = {
		gameName: (<HTMLInputElement>document.getElementById("game-name")).value,
		setNote: (<HTMLInputElement>document.getElementById("set-notes")).value,
		date: getCurrentDate(),
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

	for (let i=1; i<getPlayerCount()+1; i++) {
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
	for (let p=1; p<getPlayerCount()+1; p++) {
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
	for (let p=1; p<getPlayerCount()+1; p++) {
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


export function storeResults() {
	// Stores current set + players, then clears the forms
	if (validateSet()) {
		storeSet();
		storePlayers();
		clearFields(false, false);
		updateResults();
	}
}


export function clearStorage() {
	// Clears all vars used to store results data
	storedSets = [];
	playerData.clear();
}
