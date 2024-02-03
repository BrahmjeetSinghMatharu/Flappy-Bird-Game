let flappyCanvas;
let ctx;
let birdY;
let birdVelocity;
let gravity;
let birdImg;
let tunnelImg; // New variable for tunnel image
let tunnels;
let gameInterval;
let score;
let speed;

const birdImage = new Image();
birdImage.src = './flappy.png';

// Load the tunnel image
const tunnelImage = new Image();
tunnelImage.src = './tunnel.png';

document.addEventListener('keydown', flapBird);

function startGame() {
  document.getElementById('startButton').style.display = 'none';
  document.getElementById('restartButton').style.display = 'none';
  document.getElementById('flappyCanvas').style.display = 'block';

  flappyCanvas = document.getElementById('flappyCanvas');
  ctx = flappyCanvas.getContext('2d');
  flappyCanvas.width = window.innerWidth - 20;
  flappyCanvas.height = window.innerHeight - 20;

  birdImg = birdImage;
  tunnelImg = tunnelImage; // Assign the tunnel image
  birdY = flappyCanvas.height / 2 - 15;
  birdVelocity = 0;
  gravity = 0.14;
  tunnels = [];
  gameInterval = setInterval(updateGame, 7);
  score = 0;
  speed = 3;
}

function flapBird(event) {
  if (event.code === 'Space') {
    birdVelocity = -4;
  }
}

function updateGame() {
  ctx.clearRect(0, 0, flappyCanvas.width, flappyCanvas.height);
  birdVelocity += gravity;
  birdY += birdVelocity;

  if (birdY < 0) {
    birdY = 0;
    birdVelocity = 0;
  }

  drawBird();
  drawTunnels();
  checkCollision();
  updateScore();
}

function drawBird() {
  ctx.drawImage(birdImg, 50, birdY, 75, 65);
}

function drawTunnels() {
  if (Math.random() < 0.02) {
    tunnels.push({ x: flappyCanvas.width, heightTop: Math.random() * 170 + 100, heightBottom: Math.random() * 180 + 150 });
  }

  for (let i = 0; i < tunnels.length; i++) {
    tunnels[i].x -= speed;
    drawTunnel(tunnels[i]);
  }

  tunnels = tunnels.filter(tunnel => tunnel.x > -50);
}

function drawTunnel(tunnel) {
  // Use the tunnel image instead of a solid color
  ctx.drawImage(tunnelImg, tunnel.x, 0, 50, tunnel.heightTop);
  ctx.drawImage(tunnelImg, tunnel.x, flappyCanvas.height - tunnel.heightBottom, 50, tunnel.heightBottom);
}

// Rest of the code remains unchanged


function checkCollision() {
  if (birdY + 30 > flappyCanvas.height) {
    birdVelocity = 0;
    birdY = flappyCanvas.height - 30;
    endGame();
  }

  tunnels.forEach(tunnel => {
    if (
      birdY < tunnel.heightTop ||
      birdY + 30 > flappyCanvas.height - tunnel.heightBottom
    ) {
      if (50 + 30 > tunnel.x && 50 < tunnel.x + 50) {
        endGame();
      }
    }
  });
}

function updateScore() {
  ctx.fillStyle = '#000';
  ctx.font = '40px Arial';
  ctx.fillText('Score: ' + score, flappyCanvas.width - 170, 30);

  tunnels.forEach(tunnel => {
    if (50 > tunnel.x && 50 - speed < tunnel.x) {
      score++;
    }
  });
}

function endGame() {
  clearInterval(gameInterval);
  // alert('Game Over! Your score is: ' + score);
  document.getElementById('startButton').style.display = 'block';
  document.getElementById('restartButton').style.display = 'block';
  document.getElementById('flappyCanvas').style.display = 'none';
}