const socket = io();

const message = document.getElementById('message');
const formEl = document.getElementById('question');
const input = document.getElementById('input');
const acceptBtnEl = document.getElementById('accept');
const submitBtnEl = document.getElementById('submitBtn');
const inputFields = formEl.querySelectorAll('input');
const errorEl = formEl.querySelector('.error-message');

let question;
let hint;
let answer;
let questions = [];
const letterPattern = /^[A-Za-z]+$/;

function objectToCookieString(obj) {
  return encodeURIComponent(JSON.stringify(obj));
}
function cookieStringToObject(str) {
  return JSON.parse(decodeURIComponent(str));
}

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

function clearCookie(key) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function putQuestionToCookies() {
  clearCookie('question');
  const otherQuestions = questions.filter(
    (q) => q.username !== getCookie('user').username
  );
  const cookieQuestion = objectToCookieString(
    otherQuestions[Math.floor(Math.random() * otherQuestions.length)]
  );
  setCookie('question', cookieQuestion, 1);
}

function areAllFieldsFilled() {
  return [...inputFields].every((input) => input.value.trim() !== '');
}

function updateSubmitButtonState() {
  const invalidInputs = [];
  inputFields.forEach((input) => {
    const value = input.value.trim();
    if (value === '') {
      submitBtnEl.disabled = true;
    } else if (!letterPattern.test(value)) {
      invalidInputs.push(input);
      submitBtnEl.disabled = true;
    }
  });

  if (invalidInputs.length > 0) {
    errorEl.innerText = 'Invalid input: input must contain only letters';
  } else {
    errorEl.innerText = '';
    submitBtnEl.disabled = !areAllFieldsFilled();
  }
}

inputFields.forEach((input) => {
  input.addEventListener('input', updateSubmitButtonState);
});

formEl.addEventListener('submit', function (e) {
  e.preventDefault();
  question = formEl.querySelector('#inputQuestion').value;
  hint = formEl.querySelector('#inputHint').value;
  answer = formEl.querySelector('#inputAnswer').value;
  socket.emit('ask question', { question, hint, answer });

  message.classList.remove('d-none');
  submitBtnEl.disabled = true;
  submitBtnEl.classList.add('d-none');
});

acceptBtnEl.addEventListener('click', (e) => {
  socket.emit('accept question', { question, hint, answer });
  putQuestionToCookies();
  window.location.href = './game.html';
});

socket.on('connect', () => {
  socket.emit('setUsername', getCookie('user').username || 'Incognito');
});

socket.on('players ready', (questionsPool) => {
  console.log(questionsPool);
  questions = questionsPool;
  message.innerText = '';
  acceptBtnEl.classList.remove('d-none');
});
