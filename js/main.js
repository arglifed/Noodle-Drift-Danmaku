// js/main.js

// Initialize the High Score UI from LocalStorage
updateScoresUI();

/**
 * Handles the transition from Title Screen to Active Gameplay
 */
const startTrigger = () => {
    if (!gameStarted) {
        gameStarted = true;
        console.log("Session Started: Good luck, Chef!");
        // Future: Play 'game_start' SFX here
    }
};

// Wrap startup in an async function to handle the API handshake
const initGame = async () => {
    console.log("--- Noodle Drift: Four Swords Edition ---");
    console.log("Regional Hub: UP-906 (Marquette)");

    // 1. Attempt to sync with the Hub/API
    const userData = await HubAPI.getActiveLoadout("LOCAL_TEST_USER");

    if (userData && userData.activeCompanion) {
        activeCompanion = Companions[userData.activeCompanion];
        console.log(`Hub Sync Successful: ${activeCompanion.name} equipped via API.`);
    } else {
        console.log(activeCompanion ? 
            `Using Local Loadout: ${activeCompanion.name}` : 
            "No companion equipped. Playing in Standard Mode.");
    }

    // 2. Add Interaction Listeners to "Press Start"
    window.addEventListener('keydown', (e) => { 
        // Space to start on Web, '1' to start on Cabinet
        if(e.code === 'Space' || e.key === '1') startTrigger(); 
    });
    canvas.addEventListener('mousedown', startTrigger);
    canvas.addEventListener('touchstart', startTrigger);

    // 3. Start the loop (Engine will draw the Start Screen until gameStarted is true)
    loop();
};

// Wait for the ramen bowl sprite to load before starting the handshake
bowlImg.onload = () => {
    initGame();
};

// Error handling for missing assets
bowlImg.onerror = () => {
    console.error("FAILED TO LOAD BOWL IMAGE. Check assets/images/bowl.png");
    alert("Game Error: Missing assets. Check the console.");
};