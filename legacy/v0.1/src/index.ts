import { setupPlayers } from './form.js';
import { updateResults } from './storage.js';
import { addListeners } from './nav.js';

function initialize() {
    setupPlayers();
    updateResults();
    addListeners();
    
}

initialize();