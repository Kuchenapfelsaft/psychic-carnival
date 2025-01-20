const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let spaceship = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 5
};

let bullets = [];
let enemies = [];
let score = 0;

function gameLoop() {
  setTimeout(function() {
    clearCanvas();
    drawSpaceship();
    drawBullets();
    drawEnemies();
    moveBullets();
    moveEnemies();
    checkCollisions();
    drawScore();
    gameLoop();
  }, 1000 / 60); // 60 FPS
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSpaceship() {
  ctx.fillStyle = "blue";
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function moveSpaceship(event) {
  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;
  spaceship.x = mouseX - spaceship.width / 2;
  spaceship.y = mouseY - spaceship.height / 2;
}

function shootBullet() {
  let bullet = {
    x: spaceship.x + spaceship.width / 2 - 2.5,
    y: spaceship.y,
    width: 5,
    height: 10,
    speed: 7
  };
  bullets.push(bullet);
}

function drawBullets() {
  ctx.fillStyle = "red";
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function moveBullets() {
  bullets.forEach(bullet => {
    bullet.y -= bullet.speed;
  });
  bullets = bullets.filter(bullet => bullet.y > 0); // Remove bullets off-screen
}

function createEnemy() {
  let enemy = {
    x: Math.random() * (canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    speed: 2
  };
  enemies.push(enemy);
}

function drawEnemies() {
  ctx.fillStyle = "green";
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

function moveEnemies() {
  enemies.forEach(enemy => {
    enemy.y += enemy.speed;
  });
  enemies = enemies.filter(enemy => enemy.y < canvas.height); // Remove enemies off-screen
}

function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
        bullets.splice(bulletIndex, 1); // Remove bullet
        enemies.splice(enemyIndex, 1); // Remove enemy
        score += 10; // Increase score
      }
    });
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

document.addEventListener("mousemove", moveSpaceship);
document.addEventListener("keydown", event => {
  if (event.key === " ") {
    shootBullet();
  }
});

setInterval(createEnemy, 1000); // Create an enemy every second
gameLoop();
