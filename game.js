const letters = document.querySelectorAll('.image-fluid');
const questionElement = document.querySelector('#question');
const answerElement = document.querySelector('#answer');
const livesElement = document.querySelector('#lives');

const category = 'hightech';
let livesLeft = 10;
const solvedLetIndexes = [];

window.addEventListener('load', async () => {
  const fetchQuestions = async (path) => {
    const res = await fetch(path);
    const data = await res.json();
    return data;
  };

  const getQuestion = (category, data) => {
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
    const line = document.getElementById(`line${index}`);
    line.classList.add('draw-line');
    index++;
  }

  const handleLetterClick = (letter) => {
    if (livesLeft === 0) console.log('you lost');
    const indexes = [...answer.matchAll(new RegExp(letter, 'gi'))].map(
      (a) => a.index
    );

    if (indexes.length === 0) {
      livesLeft--;
      nextLine();
    }

    renderAnswer(indexes);
  };

  letters.forEach((letterEl) =>
    letterEl.addEventListener('click', () => {
      handleLetterClick(letterEl.dataset.letter);
      letterEl.style.filter = 'brightness(80%)';
    })
  );

  const data = await fetchQuestions('./data.json');
  const { question, hint, answer } = getQuestion(category, data);

  livesElement.innerText = `Lives: ${livesLeft}`;
  questionElement.innerText = question;
  const answerHTML = `<img src="./images/input_square.png"/>`.repeat(
    answer.length
  );
  answerElement.innerHTML = answerHTML;
});
