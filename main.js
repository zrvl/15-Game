class Game {
  #field;
  #startGame;
  #timer;
  #counter;
  constructor(field) {
    this.#field = field;
    this.#startGame = false;
    this.#timer
    this.#counter = 0;
  }
  generateField() {
    for (let i = 0; i <= 15; i++) {
      let cell = document.createElement('div');
      cell.className = `cell ${i}`;
      cell.innerHTML = i != 0 ? i : '';
      this.#field.append(cell);
    }
  }
  move() {
    const controllerMove = (cell, tmp) => {
      let changeCell;
      const moveMouse = (e) => {
        cell.style.left = e.pageX - cell.offsetWidth / 2 + 'px';
        cell.style.top = e.pageY - cell.offsetHeight / 2 + 'px';
        cell.style.display = 'none';
        changeCell = document.elementFromPoint(e.clientX, e.clientY);
        cell.style.display = 'flex';
      }
      document.addEventListener("mousemove", moveMouse);
      cell.onmouseup = () => {
        if (changeCell) {
          if (changeCell.textContent === "") {
            changeCell.textContent = cell.textContent;
            changeCell.append(cell);
            cell.remove();
            let winner = this.checkWin();
            if (winner) {
              winnerDiv.style.display = 'flex';
            }
          }
          else {
            console.log(tmp);
            cell.style.position = '';
            tmp.before(cell);
            tmp.remove();
          }
          document.removeEventListener("mousemove", moveMouse);
          cell.onmouseup = null;
        }
      }
    }
    field.onmousedown = (e) => {
      if (!this.#startGame) {
        this.startTimer();
        this.#startGame = true;
      }
      const cell = e.target;
      if (cell.textContent !== "" && this.checkOnMouseDown(cell)) {
        const tmp = document.createElement('div');
        tmp.className = 'cell tmp';
        tmp.innerHTML = '';
        cell.before(tmp);
        cell.style.position = 'absolute';
        cell.style.zIndex = 100;
        document.body.append(cell);
        cell.style.left = e.pageX - cell.offsetWidth / 2 + 'px';
        cell.style.top = e.pageY - cell.offsetHeight / 2 + 'px';
        cell.ondragstart = () => false;
        controllerMove(cell, tmp);
      }
    };
  }
  checkOnMouseDown(cell) {
    let arrOfActive = [];
    let cells = this.#field.children;
    for (let idx = 0; idx < cells.length; idx++) {
      if (cells[idx].textContent == "") {
        if (
          cells[idx - 1] == cell ||
          cells[idx + 1] == cell ||
          cells[idx - 4] == cell || 
          cells[idx + 4] == cell
          ) {
            return true;
          }
          arrOfActive.push(
            cells[idx - 1],
            cells[idx + 1],
            cells[idx - 4],
            cells[idx + 4]
          );
          this.checkBlock(arrOfActive, cells);
          return false;
        }
      }
    }
    checkBlock(arr, cells) {
      let arrStepBack = [];
      let arrStepForward = [];
      arrStepBack.push(cells[3], cells[7], cells[11]);
      arrStepForward.push(cells[4], cells[8], cells[12]);
      for (let backCell of arrStepBack) {
        if (backCell == arr[0]) {
          backCell.style.backgroundColor = "#fff";
        }
      }
      for (let forwardCell of arrStepForward) {
        if (forwardCell == arr[1]) {
          forwardCell.style.backgroundColor = "#fff";
        }
      }
      for (let block of arr) {
        if (block == undefined) {
          continue;
        }
        block.classList.add("bgColor");
      }
      setTimeout(() => {
        for (let block of arr) {
          if (block == undefined) {
            continue;
          }
          block.classList.remove("bgColor");
        }
      }, 1000);
    }
    startTimer() {
      let min = 0;
      this.#timer = setInterval(() => {
        this.#counter++;
        if (this.#counter == 60) {
          this.#counter = 0;
          min++;
        }
        if (min == 5) {
          loseDiv.style.display = 'flex';
          for (let block of this.#field.children) {
            block.style.pointerEvents = 'none';
          }
          clearInterval(this.#timer);
        }
        timerBlock.textContent = `${min}:${this.#counter}`;
      }, 1000)
    }
    checkWin() {
      const winNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ''];
      let arrWin = [];
      for (let element of field.children) {
        arrWin.push(element.textContent);
      }
      for (let i=0; i<winNumbers.length; i++) {
        if (winNumbers[i] != arrWin[i]) {
          return false;
        }
      }
      return true;
    }
    restartBtn() {
      let btn = document.querySelector('.btn').addEventListener('click', () => {
        loseDiv.style.display = 'none';
        winnerDiv.style.display = 'none';
        this.#field.innerHTML = '';
        clearInterval(this.#timer);
        this.#counter = 0;
        timerBlock.textContent = this.#counter;
        this.#startGame = false;
        for (let i=0; i<=15; i++) {
          let cell = document.createElement('div');
          cell.className = `cell ${i}`;
          cell.innerHTML = i != 0 ? i : '';
          this.#field.append(cell);
        }
      });
    }
  startGame() {
    this.generateField();
    this.move();
    this.checkWin();
    this.restartBtn();
  }
}

const winnerDiv = document.querySelector('.winner');
const timerBlock = document.querySelector('.timer');
const loseDiv = document.querySelector('.lose');
const field = document.querySelector('.field');
const game = new Game(field);
game.startGame();
