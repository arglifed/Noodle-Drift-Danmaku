// js/core/api.js

const API_CONFIG = {
    BASE_URL: "https://api.arcadeimpact.org/v1", // Future Hub URL
    HUB_ID: "UP-906-MQT", // Marquette Regional ID
    IS_DEV: true // Set to false when connecting to the real server
};

const HubAPI = {
    // 1. Fetch the user's "Loadout" (Companions, Skins)
    async getActiveLoadout(sessionID) {
        if (API_CONFIG.IS_DEV) return null; // Fallback for Saturday testing

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/loadout?session=${sessionID}`);
            return await response.json();
        } catch (err) {
            console.error("Hub Connection Failed:", err);
            return null;
        }
    },

    // 2. Submit the Final Score for the Impact Report
    async submitScore(finalScore, comboMax) {
        console.log(`[API] Submitting Score: ${finalScore} to ${API_CONFIG.HUB_ID}`);
        
        if (API_CONFIG.IS_DEV) {
            console.log("[API] DEV MODE: Local score saved.");
            return { success: true, impactGenerated: Math.floor(finalScore / 100) };
        }

        // Production POST request for the 501(c)(3) ledger
        return await fetch(`${API_CONFIG.BASE_URL}/impact/submit`, {
            method: 'POST',
            body: JSON.stringify({ score: finalScore, hub: API_CONFIG.HUB_ID })
        });
    }
};