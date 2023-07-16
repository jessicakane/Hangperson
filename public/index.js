const DEFAULT_NAME = 'Incognito';
const gamesRatioEl = document.querySelector('.games-ratio');
const bestTimeEl = document.querySelector('.best-time');

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

function setCookie(name, value, expirationDays) {
  const expires = new Date();
  expires.setDate(expires.getDate() + expirationDays);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

const usernameBtnEL = document.querySelector('#usernameBtn');
const usernameInputEl = document.querySelector('#usernameInput');

let userObj = {};

const createUser = async (username) => {
  try {
    const response = await fetch(`http://localhost:3000/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return {
      username: DEFAULT_NAME,
      gamesPlayed: 0,
      gamesWon: 0,
    };
  }
};

const showUserStats = async (user) => {
  let minutes = Math.floor(+user.time / 60000);
  let seconds = Math.floor((+user.time % 60000) / 1000);

  const bestTime = user.time
    ? minutes.toString().padStart(2, '0') +
      ':' +
      seconds.toString().padStart(2, '0')
    : 'not set';

  gamesRatioEl.innerText = `Games won: ${user.gamesWon}/${user.gamesPlayed}`;
  bestTimeEl.innerText = `Best time: ${bestTime}`;
};

usernameBtnEL.addEventListener('click', async () => {
  const username = usernameInputEl.value || DEFAULT_NAME;
  userObj = await createUser(username);

  const cookieUser = objectToCookieString(userObj);
  setCookie('user', cookieUser, 2); // Expires in 2 days

  showUserStats(userObj);
});

window.onload = async () => {
  if (getCookie('user')) await showUserStats(getCookie('user'));
};
