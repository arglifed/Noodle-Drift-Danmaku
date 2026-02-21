const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const scoreList = document.getElementById('scoreList');

canvas.width = 450;
canvas.height = 700;

const bowlImg = new Image();
bowlImg.src = 'assets/images/bowl.png'; 

let score = 0;
let gameActive = true;
let scrollPos = 0;
let speed = 4.5;
let frame = 0;
let highScores = JSON.parse(localStorage.getItem('fs_high_scores')) || [];

const player = { x: 200, y: 550, w: 64, h: 64, vx: 0, drifting: false, rotation: 0, hitboxRadius: 4 };
const obstacles = [];
const medals = [];
const steam = [];
const grazes = [];

const startDrift = () => player.drifting = true;
const stopDrift = () => player.drifting = false;

window.addEventListener('keydown', (e) => { if(e.code === 'Space') startDrift(); });
window.addEventListener('keyup', (e) => { if(e.code === 'Space') stopDrift(); });
canvas.addEventListener('mousedown', startDrift);
canvas.addEventListener('mouseup', stopDrift);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrift(); });
canvas.addEventListener('touchend', stopDrift);

function updateScoresUI() {
    scoreList.innerHTML = highScores.length ? 
        highScores.map((s, i) => `<div>${i+1}. ${Math.floor(s).toString().padStart(6, '0')}</div>`).join('') :
        "<div style='text-align:center'>NO DATA</div>";
}

function saveHighScore(s) {
    highScores.push(s);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);
    localStorage.setItem('fs_high_scores', JSON.stringify(highScores));
    updateScoresUI();
}

function spawn() {
    const difficulty = Math.min(score / 12000, 1); 
    if (frame % Math.max(30, Math.floor(85 - (difficulty * 55))) === 0) {
        obstacles.push({ x: Math.random() * (canvas.width - 32), y: -50, w: 32, h: 32 });
    }
    const medalChance = 0.45 + (difficulty * 0.45);
    if (frame % 15 === 0 && Math.random() < medalChance) {
        medals.push({ x: Math.random() * (canvas.width - 25), y: -50, w: 25, h: 25 });
    }
    if (frame % 5 === 0) {
        steam.push({ x: player.x + player.w/2 + (Math.random()*16-8), y: player.y + 15, size: 2 + Math.random()*5, life: 1.0 });
    }
}

function update() {
    if (!gameActive) return;
    frame++;
    speed = 4.5 + (score / 2000); 
    scrollPos = (scrollPos + speed) % 80; 
    
    // Base engagement score
    score += 0.25;

    if (player.drifting) {
        player.vx += 0.8; 
        player.rotation = Math.min(player.rotation + 0.06, 0.35);
    } else {
        player.vx -= 0.8;
        player.rotation = Math.max(player.rotation - 0.06, -0.35);
    }

    // COMPANION HOOK: Barnaby increases momentum retention (e.g., 0.96 vs 0.94)
    const currentFriction = (activeCompanion) ? activeCompanion.driftMomentum : 0.94;
    player.vx *= currentFriction; 
    
    player.x += player.vx;

    if (player.x < -5 || player.x > canvas.width - player.w + 5) {
        gameActive = false;
        saveHighScore(score);
    }

    const px = player.x + player.w/2;
    const py = player.y + player.h/2;

    obstacles.forEach((obs, i) => {
        obs.y += speed;
        const dist = Math.hypot(px - (obs.x + obs.w/2), py - (obs.y + obs.h/2));
        if (dist < player.hitboxRadius + 12) {
            gameActive = false;
            saveHighScore(score);
        } else if (dist < 50 && frame % 5 === 0) {
            // COMPANION HOOK: Points from grazes are boosted by multiplier
            const multiplier = (activeCompanion) ? activeCompanion.scoreMultiplier : 1.0;
            score += 10 * multiplier; 
            grazes.push({ x: px + 20, y: py - 20, life: 1.0 });
        }
        if (obs.y > canvas.height) obstacles.splice(i, 1);
    });

    medals.forEach((m, i) => {
        m.y += speed;
        if (Math.hypot(px - (m.x + m.w/2), py - (m.y + m.h/2)) < 38) {
            // COMPANION HOOK: Copper boosts medal collection
            const multiplier = (activeCompanion) ? activeCompanion.scoreMultiplier : 1.0;
            score += (400 * (1 + (speed/15))) * multiplier; 
            medals.splice(i, 1);
        }
        if (m.y > canvas.height) medals.splice(i, 1);
    });

    steam.forEach((p, i) => { p.y -= 2; p.life -= 0.03; if (p.life <= 0) steam.splice(i, 1); });
    grazes.forEach((g, i) => { g.y -= 1; g.life -= 0.05; if (g.life <= 0) grazes.splice(i, 1); });
    
    scoreDisplay.innerText = `SCORE: ${Math.floor(score).toString().padStart(6, '0')}`;
}

function draw() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Background Grid
    ctx.lineWidth = 2;
    for (let y = scrollPos - 80; y < canvas.height; y += 80) {
        ctx.strokeStyle = `rgba(255, 0, 255, ${0.1 + (y/canvas.height) * 0.4})`;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    for (let x = 0; x <= canvas.width; x += 50) {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }

    // Particles
    steam.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.4})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    });

    // Player
    ctx.save();
    let px = player.x + player.w/2;
    let py = player.y + player.h/2;
    ctx.translate(px, py);
    ctx.rotate(player.rotation);
    ctx.drawImage(bowlImg, -player.w/2, -player.h/2, player.w, player.h);
    ctx.fillStyle = '#fff'; ctx.shadowBlur = 10; ctx.shadowColor = '#0ff';
    ctx.beginPath(); ctx.arc(0, 0, player.hitboxRadius, 0, Math.PI*2); ctx.fill();
    ctx.restore(); ctx.shadowBlur = 0;

    // Entities
    obstacles.forEach(obs => {
        ctx.fillStyle = '#0ff'; ctx.shadowBlur = 15; ctx.shadowColor = '#0ff';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#fff'; ctx.strokeRect(obs.x+4, obs.y+4, obs.w-8, obs.h-8);
    });

    medals.forEach(m => {
        ctx.fillStyle = '#ff0'; ctx.shadowColor = '#ff0'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(m.x + m.w/2, m.y + m.h/2, 12, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    });
    ctx.shadowBlur = 0;

    grazes.forEach(g => {
        ctx.fillStyle = `rgba(255, 255, 255, ${g.life})`;
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText("GRAZE!", g.x, g.y);
    });

    // COMPANION HUD OVERLAY
    if (activeCompanion) {
        ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.fillRect(10, 10, 50, 50);
        ctx.strokeRect(10, 10, 50, 50);

        ctx.fillStyle = '#fff';
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = "center";
        ctx.fillText(activeCompanion.name[0], 35, 45); // First initial as placeholder
        
        ctx.textAlign = "left";
        ctx.font = '7px "Press Start 2P"';
        ctx.fillText("BUFF ACTIVE", 70, 25);
        ctx.fillStyle = '#ff00ff';
        ctx.fillText(activeCompanion.type, 70, 42);
    }

    // Game Over
    if (!gameActive) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = '#ff00ff'; ctx.font = '22px "Press Start 2P"'; ctx.textAlign = "center";
        ctx.fillText("DRIFT OVER", canvas.width/2, 300);
        ctx.font = '10px "Press Start 2P"'; ctx.fillStyle = '#fff';
        ctx.fillText("TAP SCREEN TO REBOOT", canvas.width/2, 350);
        canvas.onclick = () => location.reload();
    }
}

function loop() {
    update(); draw(); spawn();
    if (gameActive) requestAnimationFrame(loop);
}