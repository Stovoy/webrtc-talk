let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let x = 100;
let y = 100;
let width = canvas.clientWidth;
let height = canvas.clientHeight;

let horizontalInput = 0;
let verticalInput = 0;

let radius = 25;
let speed = 5;

let projectileRadius = 5;
let shooting = false;
let shootingDelay = 250;
let timeSinceLastShot = shootingDelay;
let projectiles = [];
let tickTime = 1000 / 60;

document.addEventListener("keydown", (event) => {
    switch (event.key.toLowerCase()) {
    case "w":
        verticalInput = -1;
        break;
    case "a":
        horizontalInput = -1;
        break;
    case "s":
        verticalInput = 1;
        break;
    case "d":
        horizontalInput = 1;
        break;
    case " ":
        shooting = true;
        break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key.toLowerCase()) {
    case "w":
        if (verticalInput === -1) {
            verticalInput = 0;
        }
        break;
    case "a":
        if (horizontalInput === -1) {
            horizontalInput = 0;
        }
        break;
    case "s":
        if (verticalInput === 1) {
            verticalInput = 0;
        }
        break;
    case "d":
        if (horizontalInput === 1) {
            horizontalInput = 0;
        }
        break;
    case " ":
        shooting = false;
        break;
    }
});

function processInputs() {
    x += speed * horizontalInput;
    y += speed * verticalInput;
    timeSinceLastShot += tickTime;
    if (shooting && timeSinceLastShot >= shootingDelay) {
        let nextX = x + speed * horizontalInput;
        let nextY = y + speed * verticalInput;
        projectiles.push({
            x: x, y: y, angle: Math.atan2(nextY - y, nextX - x),
            life: 180,
        });
        timeSinceLastShot = 0;
    }
}

function updateProjectiles() {
    let projectileSpeed = 5;
    for (let projectile of projectiles) {
        projectile.x += Math.cos(projectile.angle) * projectileSpeed;
        projectile.y += Math.sin(projectile.angle) * projectileSpeed;
        projectile.life -= 1;
    }
    for (let i = projectiles.length - 1; i >= 0; i--) {
        if (projectiles[i].life <= 0) {
            projectiles.splice(i, 1);
        }
    }
}

function gameLoop() {
    processInputs();
    updateProjectiles();
}

setInterval(gameLoop, tickTime);

function clearGraphics() {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
}

function drawPlayers() {
    context.fillStyle = "black";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
}

function drawProjectiles() {
    for (let projectile of projectiles) {
        context.fillStyle = "gray";
        context.beginPath();
        context.arc(projectile.x, projectile.y, projectileRadius, 0, Math.PI * 2);
        context.fill();
    }
}

function draw() {
    clearGraphics();
    drawPlayers();
    drawProjectiles();

    requestAnimationFrame(draw);
}

draw();
