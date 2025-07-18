export const MAXPLAYERS : number = 8; // Maximum number of player inputs per set
export const INITPLAYERS : number = 2; // Initial number of player inputs - Must be < max players!
export const MAXSETS : number = 100; // Maximum number of stored sets
export const MAX_NAME_LENGTH : number = 30; // Max number of characters in a player name field
export const INVALID_BG : string = "#FF8787"; // Style to apply to invalid form fields background-color


export interface Player {
	setWins: number;
	setTotal: number;
	scoreEarned: number;
	scoreTotal: number;
}

export interface SetData {
	gameName: string;
	setNote: string;
	date: string;
	playerNames: string[];
	playerNotes: string[];
	playerScores: number[];
}
