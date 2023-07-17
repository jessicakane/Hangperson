const socket = io();

const messages = document.getElementById('messages');
const formEl = document.getElementById('question');
const input = document.getElementById('input');
const acceptBtnEl = document.getElementById('accept');

let question;
let hint;
let answer;
let questions = [];

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

formEl.addEventListener('submit', function (e) {
  e.preventDefault();
  question = formEl.querySelector('#inputQuestion').value;
  hint = formEl.querySelector('#inputHint').value;
  answer = formEl.querySelector('#inputAnswer').value;
  socket.emit('ask question', { question, hint, answer });
});

acceptBtnEl.addEventListener('click', (e) => {
  socket.emit('accept question', { question, hint, answer });
  const cookieQuestion = objectToCookieString(questions.pop());
  setCookie('question', cookieQuestion, 1);
  window.location.href = './game.html';
});

socket.on('connect', () => {
  socket.emit('setUsername', getCookie('user').username);
});

socket.on('players ready', (questionsPool) => {
  console.log(questionsPool);
  questions = questionsPool;
});
