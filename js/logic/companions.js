// js/logic/companions.js

const Companions = {
    NONE: null,
    BARNABY: {
        id: "barnaby_v1",
        name: "Barnaby",
        rarity: 5,
        type: "Ghost Cat",
        driftMomentum: 0.96, // Retain more speed during drift
        scoreMultiplier: 1.0,
        description: "UPAWS Legend: High momentum drifting."
    },
    COPPER: {
        id: "copper_v1",
        name: "Copper",
        rarity: 5,
        type: "Rescue Dog",
        driftMomentum: 0.94,
        scoreMultiplier: 1.15, // 15% bonus to all points
        description: "UPAWS Legend: Massive score generation."
    }
};

/**
 * For testing today, we are hard-coding the active companion.
 * Change this to Companions.BARNABY or Companions.COPPER to test buffs!
 */
let activeCompanion = Companions.BARNABY;