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
    }
});

function processInputs() {
    x += speed * horizontalInput;
    y += speed * verticalInput;
}

setInterval(processInputs, 1000 / 60);

function draw() {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "black";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    requestAnimationFrame(draw);
}

draw();
