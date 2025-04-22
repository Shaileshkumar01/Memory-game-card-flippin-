const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const wrongSound = document.getElementById('wrongSound');
const winSound = document.getElementById('winSound');



const cardsArray = ['🍕','🍔','🍟','🌮','🍩','🍿','🥨','🍪'];
const emojiThemes = {
  Food: ['🍕','🍔','🍟','🌮','🍩','🍿','🥨','🍪','🍣','🍙','🍧','🍉','🍎','🍇'],
  Animals: ['🐶','🐱','🐭','🐹','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵'],
  Nature: ['🌲','🌳','🌴','🌵','🌻','🌼','🌷','🌹','🌺','🍄','🌸','🌞','🌝','🌈']
};

let currentTheme = 'Food';

let gameGrid = [...cardsArray, ...cardsArray];
gameGrid.sort(() => 0.5 - Math.random());
const board = document.getElementById('gameBoard');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let totalPairs = cardsArray.length;

function setDifficulty(pairCount) {
  board.innerHTML = '';
  moves = 0;
  matchedPairs = 0;
  updateMoves();

  const pool = emojiThemes[currentTheme];
  const selected = pool.slice(0, pairCount);
  gameGrid = [...selected, ...selected];
  gameGrid.sort(() => 0.5 - Math.random());
  totalPairs = pairCount;


  gameGrid.forEach(item => {
    const card = createCard(item);
    board.appendChild(card);
    card.classList.add('flipped'); // show all cards temporarily
  });

  // after few seconds hide them
  setTimeout(() => {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.remove('flipped'));
    lockBoard = false; // enable gameplay
  }, 800);
}

document.getElementById('themeSelect').addEventListener('change', (e) => {
  currentTheme = e.target.value;
  setDifficulty(totalPairs); // restart game with new theme
});



function updateMoves() {
  document.getElementById('moves').textContent = `Moves: ${moves}`;
  //stars
  const starsEl = document.getElementById('stars');
  if (moves <= 12) {
    starsEl.textContent = '⭐⭐⭐';
  } else if (moves <= 20) {
    starsEl.textContent = '⭐⭐';
  } else {
    starsEl.textContent = '⭐';
  }
}

function createCard(item) {
  
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.item = item;

  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');

  const front = document.createElement('div');
  front.classList.add('card-front');
  front.innerText = item;

  const back = document.createElement('div');
  back.classList.add('card-back');
  back.innerText = '?';

  cardInner.appendChild(front);
  cardInner.appendChild(back);
  card.appendChild(cardInner);

  card.addEventListener('click', () => {
    if (lockBoard || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flipSound.currentTime = 0;
    flipSound.play();

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      lockBoard = true;
      moves++;
      updateMoves();

      if (firstCard.dataset.item === secondCard.dataset.item) {
        matchedPairs++;
        matchSound.currentTime = 0;
         matchSound.play();
        if (matchedPairs === totalPairs) {
          winSound.currentTime = 0;
          winSound.play(); // 🔊 Play win sound!

          launchConfetti(); // 🎉 Multiburst celebration

            
          document.getElementById('finalMoves').textContent = `You finished in ${moves} moves!`;
          document.getElementById('winModal').classList.remove('hidden');
        }

        resetCards();
      } else {
        wrongSound.currentTime = 0;
        wrongSound.play();
        setTimeout(() => {
          firstCard.classList.remove('flipped');
          secondCard.classList.remove('flipped');
          resetCards();
        }, 1000);
      }
    }
  });

  return card;
}

function resetCards() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function restartGame() {
  location.reload(); // reload
}

// Initial stage
setDifficulty(8); // Default: Medium







//confeti
function launchConfetti() {
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 10,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 10,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
