import { MAXSETS } from './constants.js';
import { storeResults, clearStorage, updateResults, getPlayerData, getSetData } from './storage.js';
import { clearFields, addPlayer, removePlayer } from './form.js';
import { exportSetData, exportPlayerData } from './exporter.js';


function storeButton() {
	//Function for the "store" button
	if (getSetData().length < MAXSETS) {
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
		clearFields(true, false);
	}
}


function clearAllButton() {
	// Function for "clear all" button
	if (window.confirm("Clear all fields AND stored data? WARNING - this cannot be undone!")) {
		clearStorage();
		clearFields(true, true);
		updateResults();
	}
}


export function addListeners() {
	// Adds all listeners to buttons

	// Nav Buttons
	document.getElementById("nav-store").addEventListener('click', () => {
		storeButton();
	})

	document.getElementById("nav-clear").addEventListener('click', () => {
		clearButton();
	})

	document.getElementById("nav-clearall").addEventListener('click', () => {
		clearAllButton();
	})

	document.getElementById("nav-export-players").addEventListener('click', () => {
		exportPlayerData(getPlayerData());
	})

	document.getElementById("nav-export-sets").addEventListener('click', () => {
		exportSetData(getSetData());
	})

	// Form Buttons
	document.getElementById("add-button").addEventListener('click', () => {
		addPlayer();
	})

	document.getElementById("remove-button").addEventListener('click', () => {
		removePlayer();
	})
}
