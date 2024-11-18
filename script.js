const emojis = ["🍎", "🍇", "🍓", "🍑", "🥭", "🍏"];

const conform = document.getElementById("conformation-section__popup");
const gameStartBtn = document.getElementById("game-start-btn");

let changeCardFlipped = 2; // Default 2 cards flipping

let score = 0;
let flippedCards = [];
let matchedCards = [];
let lockedCard = false;

// Generate pairs dynamically based on user input
const createDynamicArray = (emojis, pairs) => {
  const dynamicArray = [];
  const pairsNeeded = 12 / pairs; // Calculate how many emojis are needed

  for (let i = 0; i < pairsNeeded; i++) {
    for (let j = 0; j < pairs; j++) {
      dynamicArray.push(emojis[i]); // Add the emoji to match the pair count
    }
  }

  return dynamicArray.sort(() => Math.random() - 0.5); // Shuffle the array
};

const storeCardFront = (cardFaces, userArray) => {
  userArray.forEach((emoji, index) => {
    cardFaces[index].innerHTML = `<h2>${emoji}</h2>`;
  });
};

const isNotFlipped = (card) => {
  return !card.classList.contains("flipped");
};

const cardMatching = (flippedCards) => {
  const firstEmoji = flippedCards[0].querySelector(".back-card").innerHTML;
  return flippedCards.every(
    (card) => card.querySelector(".back-card").innerHTML === firstEmoji
  );
};

const hideCards = () => {
  setTimeout(() => {
    flippedCards.forEach((card) => card.classList.remove("flipped"));
    lockedCard = false;
    flippedCards = [];
  }, 700);
};

const hideScoreBoard = (scoreBoard) => {
  scoreBoard.classList.add("hidden");
};

const checkForLowScore = (score, totalScoreBoard) => {
  for (let i = 0; i < totalScoreBoard.length; i++) {
    totalScoreBoard[i].textContent = `Total Scores: ${score}`;
  }
};

const winBoard = (winScoreBoard) => {
  setTimeout(() => {
    winScoreBoard.classList.add("visible");
  }, 0);
};

const resetGame = (
  totalScoreBoard,
  cardFaces,
  gameClicks,
  dynamicCardArray,
  winScoreBoard,
  scoreBoard,
  emojis,
  changeCardFlipped
) => {
  const userArray = createDynamicArray(emojis, changeCardFlipped);
  storeCardFront(cardFaces, userArray);

  matchedCards = [];
  flippedCards = [];
  score = 0;

  totalScoreBoard.forEach((output) => (output.textContent = "Total Scores: 0"));
  gameClicks.forEach((click) => (click.textContent = "Total Clicks: 0"));

  winScoreBoard.classList.remove("visible");
  scoreBoard.classList.remove("hidden");
  dynamicCardArray.forEach((card) => card.classList.remove("flipped"));
};

gameStartBtn.addEventListener("click", () => {
  conform.classList.add("scale-start-btn");
});

document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game-card__container");
  const addDynamicCard = document.getElementById("game-card-wrapper");
  const selectCard = document.getElementById("selectCard");
  let dynamicCardArray = [];

  addDynamicCard.innerHTML = new Array(12)
    .fill("")
    .map(
      (_, index) => `
    <div id="game-card-${index + 1}" class="game-card">
      <div class="front-card"></div>
      <div class="back-card"></div>
    </div>
  `
    )
    .join("");

  dynamicCardArray = Array.from(document.querySelectorAll(".game-card"));
  const cardFaces = Array.from(
    document.querySelectorAll(".game-card .back-card")
  );
  const scoreBoard = document.getElementById("game-content__wrapper");
  const gameClicks = document.querySelectorAll(".total-clicked");
  const totalScoreBoard = document.querySelectorAll(".total-score");
  const winScoreBoard = document.getElementById("game-win-board");
  const newGameStartBtn = document.getElementById("new-game-start");
  const gameNotRestarted = document.getElementById("game-not-restarted");

  storeCardFront(cardFaces, createDynamicArray(emojis, changeCardFlipped));

  selectCard.addEventListener("change", (e) => {
    changeCardFlipped = parseInt(e.target.value) || 2; // Get the selected value or default to 2
    resetGame(
      totalScoreBoard,
      cardFaces,
      gameClicks,
      dynamicCardArray,
      winScoreBoard,
      scoreBoard,
      emojis,
      changeCardFlipped
    );
  });

  gameContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".game-card");

    if (!card || lockedCard || !isNotFlipped(card)) return;

    card.classList.add("flipped");
    flippedCards.push(card);
    score++;

    gameClicks.forEach(
      (click) => (click.textContent = "Total Clicks: " + score)
    );

    if (flippedCards.length === changeCardFlipped) {
      if (cardMatching(flippedCards)) {
        matchedCards.push(...flippedCards);
        flippedCards = [];
      } else {
        lockedCard = true;
        hideCards();
      }
    }

    if (matchedCards.length === 12) {
      checkForLowScore(score, totalScoreBoard);
      hideScoreBoard(scoreBoard);
      winBoard(winScoreBoard);
    }
  });

  newGameStartBtn.addEventListener("click", () => {
    resetGame(
      totalScoreBoard,
      cardFaces,
      gameClicks,
      dynamicCardArray,
      winScoreBoard,
      scoreBoard,
      emojis,
      changeCardFlipped
    );
  });
  gameNotRestarted.addEventListener("click", () => {
    window.location.reload(true);
  });
});
