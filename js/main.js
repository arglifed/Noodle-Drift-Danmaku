// js/main.js

// Initialize the High Score UI from LocalStorage
updateScoresUI();

// Wait for the ramen bowl sprite to load before starting the loop
bowlImg.onload = () => {
    console.log("--- Noodle Drift: Four Swords Edition ---");
    console.log("Regional Hub: UP-906 (Marquette)");
    
    if (activeCompanion) {
        console.log(`Active Companion: ${activeCompanion.name} equipped.`);
    } else {
        console.log("No companion equipped. Playing in Standard Mode.");
    }
    
    loop();
};

// Error handling for missing assets
bowlImg.onerror = () => {
    console.error("FAILED TO LOAD BOWL IMAGE. Check assets/images/bowl.png");
    alert("Game Error: Missing assets. Check the console.");
};