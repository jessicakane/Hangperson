const letters = document.querySelectorAll('.image-fluid');
const questionElement = document.querySelector('#question');
const answerElement = document.querySelector('#answer');

const category = 'hightech';

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

letters.forEach((letterEl) =>
  letterEl.addEventListener('click', () =>
    console.log(letterEl.dataset.letter, 'is clicked')
  )
);

window.addEventListener('load', async () => {
  const data = await fetchQuestions('./data.json');
  const { question, hint, answer } = getQuestion(category, data);

  questionElement.innerText = question;
  const answerHTML = `<img src="./images/input_square.png"/>`.repeat(
    answer.length
  );
  answerElement.innerHTML = answerHTML;
});
