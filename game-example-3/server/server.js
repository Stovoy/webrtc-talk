const fastify = require('fastify')();

fastify.register(require('fastify-ws'));

let players = new Set();

fastify.ready((err) => {
    if (err) {
        throw err;
    }

    console.log('Server started');

    let id = 0;

    fastify.ws.on('connection', (socket) => {
        console.log('Client connected');
        let player = {
            id: id,
            socket: socket,
            x: 200, y: 200, horizontal: 0, vertical: 0, shooting: false, timeSinceLastShot: shootingDelay,
        };
        players.add(player);
        id += 1;

        socket.on('message', (message) => {
            message = JSON.parse(message);
            if (message.up !== undefined) {
                if (message.up.horizontal === player.horizontal) {
                    player.horizontal = 0;
                }
                if (message.up.vertical === player.vertical) {
                    player.vertical = 0;
                }
                if (message.up.shooting === player.shooting) {
                    player.shooting = false;
                }
            } else if (message.down !== undefined) {
                if (message.down.horizontal !== undefined) {
                    player.horizontal = message.down.horizontal;
                }
                if (message.down.vertical !== undefined) {
                    player.vertical = message.down.vertical;
                }
                if (message.down.shooting !== undefined) {
                    player.shooting = message.down.shooting;
                }
            }
        });

        socket.on('close', () => {
            console.log('Client disconnected');
            players.delete(player);
        });
    });

    startGame();
});

const tickTime = 1000 / 60;
let speed = 5;

let shootingDelay = 250;
let projectiles = [];

function processInputs() {
    for (let player of players) {
        player.x += speed * player.horizontal;
        player.y += speed * player.vertical;
        player.timeSinceLastShot += tickTime;
        if (player.shooting && player.timeSinceLastShot >= shootingDelay) {
            let nextX = player.x + speed * player.horizontal;
            let nextY = player.y + speed * player.vertical;
            projectiles.push({
                x: player.x, y: player.y, angle: Math.atan2(nextY - player.y, nextX - player.x),
                life: 180,
            });
            player.timeSinceLastShot = 0;
        }
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

function sendMessages() {
    let playersData = [];
    for (let player of players) {
        playersData.push({
            id: player.id,
            x: player.x,
            y: player.y,
        });
    }

    let projectilesData = [];
    for (let projectile of projectiles) {
        projectilesData.push({
            x: projectile.x,
            y: projectile.y,
        });
    }

    for (let player of players) {
        try {
            player.socket.send(JSON.stringify({
                id: player.id,
                players: playersData,
                projectiles: projectilesData,
            }));
        } catch (e) {
            console.error(e);
        }
    }
}

function gameLoop() {
    processInputs();
    updateProjectiles();
    sendMessages();
}

function startGame() {
    setInterval(gameLoop, tickTime);
}

fastify.listen(8000);
