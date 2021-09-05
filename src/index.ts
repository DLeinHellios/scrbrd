// SetCount by DLeinHellios. Browser-based scoreboard and record keeper


import { setupPlayers } from './modules/form.js';
import { updateResults } from './modules/storage.js';
import { addListeners } from './modules/nav.js';


setupPlayers();
updateResults();
addListeners();
