const letters = document.querySelectorAll('.image-fluid');
const questionElement = document.querySelector('#question');
const answerElement = document.querySelector('#answer');
const livesElement = document.querySelector('#lives');
const gameOverElement = document.querySelector('.game-over');
const talkBubble = document.querySelector('.talk-bubble');
const replayElement = document.querySelector('.try-again');
const audio = new Audio('./soundEffects/chalkdrawing.mp3');

const SERVER_URL = 'http://localhost:3000';
const LIVES = 10;
const GAME = {
  WON: 'won',
  LOST: 'lost',
};
const COOKIE_EXP_DAYS = 2;
let livesLeft = LIVES;
let answerArray = [];
let game = 'going';
let elapsedTime;

function cookieStringToObject(str) {
  return JSON.parse(decodeURIComponent(str));
}
// Function to get the value of a cookie by name
function getCookie(name) {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    // Check if the cookie starts with the given name
    if (cookie.startsWith(name + '=')) {
      const cookieValue = cookie.substring(name.length + 1);
      return cookieStringToObject(cookieValue);
    }
  }

  return null; // Cookie not found
}

// Function to set a cookie with an object value
function setCookie(name, value, expirationDays) {
  const expires = new Date();
  expires.setDate(expires.getDate() + expirationDays);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

window.addEventListener('load', async () => {
  const getQuestionDB = async (category) => {
    questionElement.innerText = 'Loading...';
    let res;
    if (category && category !== 'surprise')
      res = await fetch(`${SERVER_URL}/questions/${category}/random`);
    else res = await fetch(`${SERVER_URL}/questions/random`);

    const data = await res.json();
    questionElement.innerText = '';

    return data;
  };

  const getQuestion = async (category) => {
    questionElement.innerText = 'Loading...';
    let res;

    if (getCookie('question')) return getCookie('question').data;

    if (category && category !== 'surprise')
      res = await fetch(`${SERVER_URL}/questions/${category}/random`);
    else res = await fetch(`${SERVER_URL}/questions/random`);

    const data = await res.json();
    questionElement.innerText = '';

    return data;
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
    for (let i = 5; i < 11; i++) {
      const line = document.getElementById(`line${i}`);
      line.classList.add('draw-line');
    }
  }

  function eraseGallow() {
    for (let i = 1; i < 5; i++) {
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

  const gameLost = async () => {
    userObj.gamesPlayed += 1;
    setCookie('user', JSON.stringify(userObj), COOKIE_EXP_DAYS);

    await fetch(`${SERVER_URL}/users/${userObj._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userObj }),
    });
  };

  const gameWon = async () => {
    userObj.gamesPlayed += 1;
    userObj.gamesWon += 1;
    console.log(+userObj.time > elapsedTime);
    if (!userObj.time || +userObj.time > elapsedTime)
      userObj.time = elapsedTime;

    setCookie('user', JSON.stringify(userObj), COOKIE_EXP_DAYS);

    await fetch(`${SERVER_URL}/users/${userObj._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userObj }),
    });
  };

  async function updateUserStats(gameStatus) {
    try {
      if (gameStatus === GAME.LOST) {
        await gameLost();
      } else {
        await gameWon();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkGameStatus = (indexes) => {
    if (livesLeft === 0) {
      gameOverElement.innerText = 'Oh no! You killed me :(';
      talkBubble.classList.add('display');
      replayElement.classList.add('display');
      disableLettersClick();
      game = 'over';
      updateUserStats(GAME.LOST);
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
      updateUserStats(GAME.WON);
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

  // Get the query parameters from the URL
  const queryParams = new URLSearchParams(window.location.search);
  let categoryValue = queryParams.get('category');

  const userObj = getCookie('user');

  const { question, hint, answer } = await getQuestion(categoryValue);
  answerArray = Array(answer.length).fill(1);

  livesElement.innerText = `Lives: ${livesLeft}`;
  questionElement.innerText = question;
  const answerHTML =
    `<div class="input-square"> <img class = "image-fluid" src="./images/input_square.png"/> </div>`.repeat(
      answer.length
    );
  answerElement.innerHTML = answerHTML;
});

replayElement.addEventListener('click', function () {
  window.location.href = 'settings.html';
});

let startTime;
let timerElement = document.getElementById('timer');
let gameTime;

function updateTimer() {
  let currentTime = new Date().getTime();
  elapsedTime = currentTime - startTime;

  let minutes = Math.floor(elapsedTime / 60000);
  let seconds = Math.floor((elapsedTime % 60000) / 1000);

  timerElement.textContent =
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0');

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
  window.addEventListener('load', function () {
    startTime = new Date().getTime();
    updateTimer();
  });
}
