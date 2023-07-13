const timerYes = document.getElementById('timer-yes');
const timerNo = document.getElementById('timer-no');

let timer = false;

const link1 = document.querySelector('#animalsLink');
const link2 = document.querySelector('#clothesLink'); 
const link3 = document.querySelector('#carsLink');
const link4 = document.querySelector('#hitechLink');
const link5 = document.querySelector('#surpriseLink');
const link6 = document.querySelector('#foodLink');
const link7 = document.querySelector('#citiesLink');
const link8 = document.querySelector('#musicLink');
let links = [link1, link2, link3, link4, link5, link6, link7, link8];

timerYes.addEventListener('click', function() {
    if (!timer) {
        for (let i = 0; i<9; i++ ) {
            timer = true;
            links[i].href = links[i].href.slice(0,-5) + 'true';
            console.log(links[i].href);
    }} else {
        return
    }
});

timerNo.addEventListener('click', function() {
    console.log(timer);
    if (timer) {
        console.log('timer is true!');
        for (let i = 0; i<9; i++ ) {
            timer = false;
            links[i].href = links[i].href.slice(0,-4) + 'false';
            console.log(links[i].href);
    }} else {
        return
        }
    });

const buttons = document.querySelectorAll('.time-btn');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((btn) => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
  });
});


