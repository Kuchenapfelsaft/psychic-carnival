// Elemente holen
const button = document.getElementById('button');
const scoreDisplay = document.getElementById('score');

// Variablen
let score = 0;

// Eventlistener für den Button
button.addEventListener('click', () => {
  score++; // Punkte erhöhen
  scoreDisplay.textContent = `Punkte: ${score}`;
});
