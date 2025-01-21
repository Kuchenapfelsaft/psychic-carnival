const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let spaceship = {
  x: canvas.width / 2,
  y: canvas.height - 70,
  width: 50,
  height: 50,
  speed: 5,
  lives: 3,
  coins: 0,
  canShoot: true,
  shootCooldown: 500
};

let bullets = [];
let enemies = [];
let enemyBullets = [];
let score = 0;
let level = 1;
let enemySpawnRate = 2000; // In Millisekunden
let gameRunning = true;

document.getElementById("buyLife").addEventListener("click", () => {
  if (spaceship.coins >= 50) {
    spaceship.coins -= 50;
    spaceship.lives++;
    updateShop();
  }
});

document.getElementById("buySpeed").addEventListener("click", () => {
  if (spaceship.coins >= 100) {
    spaceship.coins -= 100;
    spaceship.shootCooldown = Math.max(200, spaceship.shootCooldown - 100);
    updateShop();
  }
});

function updateShop() {
  document.getElementById("coins").innerText = spaceship.coins;
  document.getElementById("buyLife").disabled = spaceship.coins < 50;
  document.getElementById("buySpeed").disabled = spaceship.coins < 100;
}

function gameLoop() {
  if (!gameRunning) return;
  clearCanvas();
  drawSpaceship();
  drawBullets();
  drawEnemies();
  drawEnemyBullets();
  moveBullets();
  moveEnemies();
  moveEnemyBullets();
  checkCollisions();
  drawScore();
  drawLives();
  drawLevel();
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
  if (event.key === "ArrowLeft" || event.key === "a") {
    spaceship.x = Math.max(0, spaceship.x - spaceship.speed);
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    spaceship.x = Math.min(canvas.width - spaceship.width, spaceship.x + spaceship.speed);
  }
  if (event.key === "ArrowUp" || event.key === "w") {
    spaceship.y = Math.max(0, spaceship.y - spaceship.speed);
  }
  if (event.key === "ArrowDown" || event.key === "s") {
    spaceship.y = Math.min(canvas.height - spaceship.height, spaceship.y + spaceship.speed);
  }
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
    isAlive: true
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
  });
  enemies = enemies.filter(enemy => enemy.y < canvas.height && enemy.isAlive);
}

function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        bullets.splice(bulletIndex, 1);
        enemy.isAlive = false;
        enemies.splice(enemyIndex, 1);
        score += 10;
        spaceship.coins += 5;
        updateShop();
      }
    });
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
  ctx.fillText("Leben: " + spaceship.lives, 10, 60);
}

function drawLevel() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Welle: " + level, 10, 90);
}

function levelUp() {
  if (score >= level * 100) {
    level++;
    clearInterval(enemySpawnInterval);
    enemySpawnRate = Math.max(500, enemySpawnRate - 200);
    enemySpawnInterval = setInterval(createEnemy, enemySpawnRate);
  }
}

function gameOver() {
  gameRunning = false;
  alert("Game Over! Dein Score: " + score);
  window.location.reload();
}

document.addEventListener("keydown", moveSpaceship);
document.addEventListener("keydown", event => {
  if (event.key === " ") shootBullet();
});

let enemySpawnInterval = setInterval(createEnemy, enemySpawnRate);
gameLoop();
