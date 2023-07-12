const letters = document.querySelectorAll('.image-fluid');
const questionElement = document.querySelector('#question');
const answerElement = document.querySelector('#answer');
const livesElement = document.querySelector('#lives');

const LIVES = 10;
let livesLeft = LIVES;
let answerArray = [];

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
        const letterEl = document.createElement('span');
        letterEl.innerText = answer[i];
        answerElement.replaceChild(letterEl, answerElement.children[i]);
      }
    }
  };

  function nextLine() {
    const line = document.getElementById(`line${LIVES - livesLeft}`);
    line.classList.add('draw-line');
  }

  const disableLettersClick = () => {
    letters.forEach((letterEl) => {
      const clonedElement = letterEl.cloneNode(true);
      letterEl.parentNode.replaceChild(clonedElement, letterEl);
    });
  };

  const checkGameStatus = (indexes) => {
    if (livesLeft === 0) {
      console.log('you lost');
      disableLettersClick();
    }

    answerArray = answerArray.map((_, index) =>
      indexes.includes(index) ? 0 : answerArray[index]
    );
    if (answerArray.indexOf(1) === -1) {
      console.log('you won!');

      disableLettersClick();
    }
  };

  const handleLetterClick = (letterEl) => {
    const indexes = [
      ...answer.matchAll(new RegExp(letterEl.dataset.letter, 'gi')),
    ].map((a) => a.index);

    if (indexes.length === 0) {
      livesLeft--;
      nextLine();
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
