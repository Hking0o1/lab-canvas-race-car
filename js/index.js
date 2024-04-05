const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.font = '18px serif';

let obstacle;
let score = 0;
let obstacles = [];
let gameRunning = false;

function drawGameBoard() {
    const roadImg = new Image();
    roadImg.src = './images/road.png';
    ctx.drawImage(roadImg, 0, 0, canvas.width, canvas.height);
    drawScore();
}

class Car {
    constructor() {
        this.x = 250;
        this.y = 590;

        const img = new Image();
        img.addEventListener('load', () => {
            this.img = img;
            this.draw();
        });
        img.src = './images/car.png';
    }

    moveUp() {
        this.y -= 25;
    }

    moveDown() {
        this.y += 25;
    }

    moveLeft() {
        this.x -= 25;
    }

    moveRight() {
        this.x += 25;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, 50, 100);
    }
}

const ghost = new Car();

document.addEventListener('keydown', e => {
    switch (e.keyCode) {
        case 38:
            if (ghost.y > 0) { ghost.moveUp(); }
            break;
        case 40:
            if (ghost.y < 600) { ghost.moveDown(); }
            break;
        case 37:
            if (ghost.x > 0) { ghost.moveLeft(); }
            break;
        case 39:
            if (ghost.x < 450) { ghost.moveRight(); }
            break;
    }
    updateCanvas();
});

class Obstacle {
    constructor() {
        this.width = Math.floor(Math.random() * 400);
        this.height = Math.floor(Math.random() * 100);
        this.x = Math.floor(Math.random() * (canvas.width - this.width));
        this.y = 0;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.y += this.speed;

        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.floor(Math.random() * (canvas.width - this.width));
            this.draw();
        }
    }
}

function createObstacle() {
    obstacle = new Obstacle();
    obstacles.push(obstacle);
}

function moveObstacles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    obstacles.forEach((obstacle) => {
        obstacle.move();
    });
    if (obstacles[0].y > canvas.height) {
        obstacles.shift(); // Remove the obstacle that went beyond the canvas
        createObstacle(); // Create a new obstacle
        updateScore(); // Update the score
    }
    drawGameBoard();
}

function updateCanvas() {
    ctx.clearRect(0, 0, 700, 700);
    drawGameBoard();
    ghost.draw();
    obstacle.draw();
}

let scoreUpdated = false;

function updateScore() {
    if (!scoreUpdated) {
        score++;
        drawScore();
        scoreUpdated = true;
        setTimeout(() => {
            scoreUpdated = false;
        }, 1000); //
    }
}

function checkCollision() {
    obstacles.forEach((obstacle) => {
        if (
            ghost.x < obstacle.x + obstacle.width &&
            ghost.x + 50 > obstacle.x &&
            ghost.y < obstacle.y + obstacle.height &&
            ghost.y + 100 > obstacle.y
        ) {
            gameOver();
        }
    });
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 30);
}

function gameOver() {
    gameRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', 200, 250);
    ctx.fillText('Final Score: ' + score, 200, 300);
    resetGame();
}

function animate() {
    if (gameRunning) {
        moveObstacles();
        drawGameBoard();
        ghost.draw();
        obstacle.draw();
        checkCollision();
        updateScore();
        requestAnimationFrame(animate);
    }
}

function resetGame() {
    obstacles = [];
    score = 0;
    ghost.x = 250;
    ghost.y = 590;
    createObstacle();
    obstacle.speed = 5;
}

function startGame() {
    gameRunning = true;
    drawGameBoard();
    createObstacle();
    animate();
}

window.addEventListener('load', () => {
    let startBtn = document.querySelector('#start-button');

    startBtn.addEventListener('click', () => {
        startGame();
    });
});