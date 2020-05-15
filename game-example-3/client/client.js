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
let tickTime = 1000 / 60;

let socket = new WebSocket("ws://localhost:8000");
let serverMessages = [];
let queuedEvents = [];
let gameState = null;

socket.onopen = () => {
    console.log("Server connected");
    startGame();
};

socket.onmessage = (event) => {
    console.log(`Message received: ${event.data}`);
    serverMessages.push(JSON.parse(event.data));
};


function gameLoop() {
    processServerMessages();
    draw();
    processInputs();
    sendClientMessage();
}

document.addEventListener("keydown", (event) => {
    switch (event.key.toLowerCase()) {
    case "w":
        queuedEvents.push({down: {vertical: -1}});
        break;
    case "a":
        queuedEvents.push({down: {horizontal: -1}});
        break;
    case "s":
        queuedEvents.push({down: {vertical: 1}});
        break;
    case "d":
        queuedEvents.push({down: {horizontal: 1}});
        break;
    case " ":
        queuedEvents.push({down: {shooting: true}});
        break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key.toLowerCase()) {
    case "w":
        queuedEvents.push({up: {vertical: -1}});
        break;
    case "a":
        queuedEvents.push({up: {horizontal: -1}});
        break;
    case "s":
        queuedEvents.push({up: {vertical: 1}});
        break;
    case "d":
        queuedEvents.push({up: {horizontal: 1}});
        break;
    case " ":
        queuedEvents.push({up: {shooting: true}});
        break;
    }
});

function processServerMessages() {
    if (serverMessages.length === 0) {
        return;
    }
    gameState = serverMessages[serverMessages.length - 1];
    serverMessages = [];
}

function sendServerUpdate() {
    for (let event of queuedEvents) {
        socket.send(JSON.stringify(event));
    }
    queuedEvents = [];
}

function gameLoop() {
    processServerMessages();
    sendServerUpdate();
}

function clearGraphics() {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
}

function drawPlayers() {
    for (let player of gameState.players) {
        if (player.id === gameState.id) {
            context.fillStyle = "green";
        } else {
            context.fillStyle = "black";
        }
        context.beginPath();
        context.arc(player.x, player.y, radius, 0, Math.PI * 2);
        context.fill();
    }
}

function drawProjectiles() {
    for (let projectile of gameState.projectiles) {
        context.fillStyle = "gray";
        context.beginPath();
        context.arc(projectile.x, projectile.y, projectileRadius, 0, Math.PI * 2);
        context.fill();
    }
}

function draw() {
    if (gameState !== null) {
        clearGraphics();
        drawPlayers();
        drawProjectiles();
    }

    requestAnimationFrame(draw);
}

function startGame() {
    draw();
    setInterval(gameLoop, tickTime);
}
