document.getElementById('drawButton').addEventListener('click',nextLine);

let index = 1;
function nextLine() {
    const line = document.getElementById(`line${index}`);
    line.classList.add('draw-line');
    index ++;
}