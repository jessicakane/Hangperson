const letters = document.querySelectorAll('.image-fluid');
const questionElement = document.querySelector('#question');
const answerElement = document.querySelector('#answer');
const livesElement = document.querySelector('#lives');
const gameOverElement = document.querySelector('.game-over');
const talkBubble = document.querySelector('.talk-bubble');
const replayElement = document.querySelector('.try-again');
const audio = new Audio('./soundEffects/chalkdrawing.mp3');

const LIVES = 10;
let livesLeft = LIVES;
let answerArray = [];
let game = 'going';

window.addEventListener('load', async () => {
  const fetchQuestions = async (path) => {
    const res = await fetch(path);
    const data = await res.json();
    return data;
  };

  const getQuestion = (category, data) => {
    if (!(category in data)) {
      const keys = Object.keys(data);
      category = keys[Math.floor(Math.random() * keys.length)];
    }

    const categoryData = data[category];
    const index = Math.floor(Math.random() * categoryData.length);
    return categoryData[index];
  };

  const renderAnswer = (indexes) => {
    livesElement.innerText = `Lives: ${livesLeft}`;

    for (let i = 0; i < answer.length; i++) {
      if (indexes.includes(i)) {
        const guessedLetterEl = answerElement.children[i].firstElementChild;
        guessedLetterEl.src = `./images/input_letters/input_${answer[
          i
        ].toUpperCase()}.png`;
      }
    }
  };

  function nextLine() {
    const line = document.getElementById(`line${LIVES - livesLeft}`);
    line.classList.add('draw-line');
  }

  function drawMan() {
    for (let i=5; i<11; i++) {
      const line = document.getElementById(`line${i}`);
      line.classList.add('draw-line');
    }  
  }

  function eraseGallow() {
    for (let i=1; i<5; i++) {
      const line = document.getElementById(`line${i}`);
      line.classList.add('invisible-line');
    }
  }

  const disableLettersClick = () => {
    letters.forEach((letterEl) => {
      const clonedElement = letterEl.cloneNode(true);
      letterEl.parentNode.replaceChild(clonedElement, letterEl);
    });
  };

  const checkGameStatus = (indexes) => {
    if (livesLeft === 0) {
      gameOverElement.innerText = 'Oh no! You killed me :(';
      talkBubble.classList.add('display');
      replayElement.classList.add('display');
      disableLettersClick();
      game = 'over';
    }

    answerArray = answerArray.map((_, index) =>
      indexes.includes(index) ? 0 : answerArray[index]
    );
    if (answerArray.indexOf(1) === -1) {
      drawMan();
      eraseGallow();
      gameOverElement.innerText = 'You saved me!';
      gameOverElement.classList.add('green');
      talkBubble.classList.add('display');
      replayElement.textContent = 'Play again!';
      replayElement.classList.add('display');
      disableLettersClick();
      game = 'over';
    }
  };

  const handleLetterClick = (letterEl) => {
    const indexes = [
      ...answer.matchAll(new RegExp(letterEl.dataset.letter, 'gi')),
    ].map((a) => a.index);

    if (indexes.length === 0) {
      livesLeft--;
      nextLine();

      audio.play();
    }
    letterEl.style.filter = 'brightness(80%)';

    renderAnswer(indexes);
    checkGameStatus(indexes);
  };

  letters.forEach((letterEl) =>
    letterEl.addEventListener('click', () => {
      handleLetterClick(letterEl);
    })
  );

  const data = await fetchQuestions('./data.json');

  // Get the query parameters from the URL
  const queryParams = new URLSearchParams(window.location.search);
  let categoryValue = queryParams.get('category');

  const { question, hint, answer } = getQuestion(categoryValue, data);
  answerArray = Array(answer.length).fill(1);

  livesElement.innerText = `Lives: ${livesLeft}`;
  questionElement.innerText = question;
  const answerHTML =
    `<div class="input-square"> <img class = "image-fluid" src="./images/input_square.png"/> </div>`.repeat(
      answer.length
    );
  answerElement.innerHTML = answerHTML;
});

replayElement.addEventListener('click', function() {
  window.location.href = 'settings.html';
});

let startTime; 
let timerElement = document.getElementById("timer");
let gameTime;

function updateTimer() {
  let currentTime = new Date().getTime(); 
  let elapsedTime = currentTime - startTime; 
  
  let minutes = Math.floor(elapsedTime / 60000);
  let seconds = Math.floor((elapsedTime % 60000) / 1000);
  
  timerElement.textContent = minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");

  if (game === 'over') {
    gameTime = timerElement.textContent;
    return;
  } 
  
  
  setTimeout(updateTimer, 1000);
}

let url = new URL(window.location.href);
console.log(url);
let timerParam = url.searchParams.get('timer');
console.log(timerParam);
if (timerParam === 'true') {
  console.log("let's time this game!");
  window.addEventListener("load", function() {
    startTime = new Date().getTime();
    updateTimer();
});
}


