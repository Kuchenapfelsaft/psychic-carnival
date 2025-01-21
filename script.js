const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let spaceship = {
  x: canvas.width / 2,
  y: canvas.height - 70,
  width: 50,
  height: 50,
  speed: 5,
  lives: 3,
  canShoot: true,
  shootCooldown: 500
};

let bullets = [];
let enemies = [];
let enemyBullets = [];
let powerUps = [];
let score = 0;
let level = 1;
let enemySpawnRate = 2000; // In Millisekunden
let gameRunning = true;

function gameLoop() {
  if (!gameRunning) return;
  clearCanvas();
  drawSpaceship();
  drawBullets();
  drawEnemies();
  drawEnemyBullets();
  drawPowerUps();
  moveBullets();
  moveEnemies();
  moveEnemyBullets();
  movePowerUps();
  checkCollisions();
  drawScore();
  drawLives();
  levelUp();
  requestAnimationFrame(gameLoop);
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
  spaceship.x = Math.max(0, Math.min(canvas.width - spaceship.width, mouseX - spaceship.width / 2));
}

function shootBullet() {
  if (!spaceship.canShoot) return;
  spaceship.canShoot = false;

  let bullet = {
    x: spaceship.x + spaceship.width / 2 - 2.5,
    y: spaceship.y,
    width: 5,
    height: 10,
    speed: 7
  };
  bullets.push(bullet);

  setTimeout(() => (spaceship.canShoot = true), spaceship.shootCooldown);
}

function drawBullets() {
  ctx.fillStyle = "red";
  bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));
}

function moveBullets() {
  bullets.forEach(bullet => (bullet.y -= bullet.speed));
  bullets = bullets.filter(bullet => bullet.y > 0);
}

function createEnemy() {
  let enemy = {
    x: Math.random() * (canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    speed: 2 + level * 0.5,
    canShoot: Math.random() < 0.5
  };
  enemies.push(enemy);
}

function drawEnemies() {
  ctx.fillStyle = "green";
  enemies.forEach(enemy => ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height));
}

function moveEnemies() {
  enemies.forEach(enemy => {
    enemy.y += enemy.speed;
    if (enemy.canShoot && Math.random() < 0.01) shootEnemyBullet(enemy);
  });
  enemies = enemies.filter(enemy => enemy.y < canvas.height);
}

function shootEnemyBullet(enemy) {
  let bullet = {
    x: enemy.x + enemy.width / 2 - 2.5,
    y: enemy.y + enemy.height,
    width: 5,
    height: 10,
    speed: 3
  };
  enemyBullets.push(bullet);
}

function drawEnemyBullets() {
  ctx.fillStyle = "yellow";
  enemyBullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));
}

function moveEnemyBullets() {
  enemyBullets.forEach(bullet => (bullet.y += bullet.speed));
  enemyBullets = enemyBullets.filter(bullet => bullet.y < canvas.height);
}

function createPowerUp() {
  let powerUp = {
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 30,
    type: Math.random() < 0.5 ? "life" : "speed",
    speed: 2
  };
  powerUps.push(powerUp);
}

function drawPowerUps() {
  powerUps.forEach(powerUp => {
    ctx.fillStyle = powerUp.type === "life" ? "pink" : "cyan";
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
  });
}

function movePowerUps() {
  powerUps.forEach(powerUp => (powerUp.y += powerUp.speed));
  powerUps = powerUps.filter(powerUp => powerUp.y < canvas.height);
}

function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
      }
    });
  });

  enemyBullets.forEach((bullet, bulletIndex) => {
    if (bullet.x < spaceship.x + spaceship.width && bullet.x + bullet.width > spaceship.x &&
        bullet.y < spaceship.y + spaceship.height && bullet.y + bullet.height > spaceship.y) {
      enemyBullets.splice(bulletIndex, 1);
      spaceship.lives--;
      if (spaceship.lives <= 0) gameOver();
    }
  });

  powerUps.forEach((powerUp, powerUpIndex) => {
    if (powerUp.x < spaceship.x + spaceship.width && powerUp.x + powerUp.width > spaceship.x &&
        powerUp.y < spaceship.y + spaceship.height && powerUp.y + powerUp.height > spaceship.y) {
      powerUps.splice(powerUpIndex, 1);
      if (powerUp.type === "life") spaceship.lives++;
      if (powerUp.type === "speed") spaceship.shootCooldown = Math.max(200, spaceship.shootCooldown - 100);
    }
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function drawLives() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Lives: " + spaceship.lives, canvas.width - 100, 30);
}

function levelUp() {
  if (score >= level * 100) {
    level++;
    enemySpawnRate = Math.max(500, enemySpawnRate - 200);
    clearInterval(enemySpawnInterval);
    enemySpawnInterval = setInterval(createEnemy, enemySpawnRate);
  }
}

function gameOver() {
  gameRunning = false;
  alert("Game Over! Dein Score: " + score);
  window.location.reload();
}

document.addEventListener("mousemove", moveSpaceship);
document.addEventListener("keydown", event => {
  if (event.key === " ") shootBullet();
});

let enemySpawnInterval = setInterval(createEnemy, enemySpawnRate);
setInterval(createPowerUp, 10000); // Power-Up alle 10 Sekunden
gameLoop();
