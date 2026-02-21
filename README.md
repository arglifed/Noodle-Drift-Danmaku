# 🍜 Noodle Drift: Four Swords Edition (UP-906 Hub)

A neon-soaked, retro-arcade **Danmaku Drift** game. Navigate the broth, dodge obstacles, and collect medals to fuel the Marquette Mutual Aid ecosystem.

---

## 🕹️ Gameplay & "Juice"
You control a ramen bowl drifting through a high-speed soup stream. 

* **PC:** Hold `SPACE` to drift right. Release to drift left.
* **Mobile:** Touch and hold to drift right. Lift to drift left.
* **Cabinet:** (In-Dev) Physical Start button simulates '1' key via Hardware Bridge.

## 🚀 Play Now
**Play it instantly in your browser here:** 👉 [https://arglifed.github.io/Noodle-Drift-Danmaku/](https://arglifed.github.io/Noodle-Drift-Danmaku/)

---

## ✨ Scoring & The "Whale" Loop
We have deepened the mechanics to reward high-skill play and community impact:

* **The Graze System:** High-level players don't just dodge—they get close. Flying near obstacles triggers a **GRAZE**, building your **Combo Multiplier**.
* **Combo Multiplier:** Maintaining a flow increases your score exponentially. 
* **Impact Ratio (100:1):** Every 100 points earned is tracked as 1 **Impact Point**. At the end of the run, the **Impact Report** shows the real-world value generated for **UPAWS** and local animal rescue.

## 🐾 Companion Buffs (Rescue Legends)
The game now supports the **Arcade Impact Companion System**. Active companions modify the physics and economy:
* **Barnaby (Ghost Cat):** +Momentum Retention (0.96 Drift Friction).
* **Copper (Rescue Dog):** +15% Score Multiplier.

## 🛠️ Technical Architecture
The project has been refactored into a modular **Regional Hub** structure:
- **`js/core/engine.js`**: Isolated physics and rendering.
- **`js/logic/companions.js`**: Meta-data for buff injection.
- **`js/core/api.js`**: The bridge for Hub Authentication and 501(c)(3) Ledger submission.
- **`assets/images/`**: Dedicated asset slots for Regional Skins (e.g., Ore Dock skin).



## 🚀 Setup & Testing
1. Clone the repo.
2. Run a local server (e.g., `python -m http.server 8000` or VS Code Live Server).
3. Open `index.html`.
4. **Dev Toggle:** In `js/logic/companions.js`, swap `activeCompanion` between `BARNABY` and `COPPER` to test different buff physics.

---
*Built for Four Swords Retropub*