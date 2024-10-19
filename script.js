document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector(".grid");
  const width = 10;
  const flagsLeft = document.querySelector("#flags-left");
  const result = document.querySelector("#result");
  let bombAmount = 20;
  let squares = [];
  let isGameOver = false;
  let flags = 0;
  let firstClick = true;

  function createBoard() {
      flagsLeft.innerHTML = bombAmount;

      for (let i = 0; i < width * width; i++) {
          const square = document.createElement("div");
          square.id = i;
          square.classList.add("valid");
          grid.appendChild(square);
          squares.push(square);
          
          square.addEventListener("click", function () {
              click(square);
          });
          
          square.addEventListener("contextmenu", function (e) {
             e.preventDefault();
              addFlag(square);
          });
      }
  }

  function click(square) {
      if (isGameOver || square.classList.contains("checked") || square.classList.contains("flag")) return;

      if (firstClick) {
          placeBombs(square.id);
          firstClick = false; 
      }

      if (square.classList.contains("bomb")) {
          gameOver();
      } else {
          let total = square.getAttribute("data");
          if (total != 0) {
              if (total == 1) square.classList.add("one");
              if (total == 2) square.classList.add("two");
              if (total == 3) square.classList.add("three");
              if (total == 4) square.classList.add("four");
              square.innerHTML = total;
              return;
          }
          checkSquare(square);
      }
      square.classList.add("checked");
  }

  function placeBombs(firstClickId) {
      const bombArray = Array(bombAmount).fill("bomb");
      const emptyArray = Array(width * width - bombAmount).fill("valid");
      const gameArray = emptyArray.concat(bombArray);
      
      let shuffledArray;
      do {
          shuffledArray = gameArray.sort(() => Math.random() - 0.5);
      } while (shuffledArray[firstClickId] === "bomb");

      for (let i = 0; i < shuffledArray.length; i++) {
          squares[i].classList.remove("bomb", "valid");
          squares[i].classList.add(shuffledArray[i]);
      }

      setNumberHints();
  }

  function setNumberHints() {
      for (let i = 0; i < squares.length; i++) {
          let total = 0;
          const isLeftEdge = i % width === 0;
          const isRightEdge = i % width === width - 1;

          if (squares[i].classList.contains("valid")) {
              if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
              if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++;
              if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
              if (i > 11 && !isLeftEdge && squares[i - width - 1].classList.contains("bomb")) total++;
              if (i < 99 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
              if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++;
              if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++;
              if (i < 89 && squares[i + width].classList.contains("bomb")) total++;
              squares[i].setAttribute("data", total);
          }
      }
  }

  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains('checked')) {
        if (!square.classList.contains('flag') && flags < bombAmount) {
            square.classList.add('flag');
            flags++;
            square.innerHTML = '🚩';
            flagsLeft.innerHTML = bombAmount - flags;
            checkForWin();
        } else if (square.classList.contains('flag')) {
            square.classList.remove('flag');
            flags--;
            square.innerHTML = '';
            flagsLeft.innerHTML = bombAmount - flags;
        }
    }
}


  function checkSquare(square) {
      const currentId = square.id;
      const isLeftEdge = (currentId % width === 0);
      const isRightEdge = (currentId % width === width - 1);

      setTimeout(function() {
          if (currentId > 0 && !isLeftEdge) clickNeighbor(currentId, -1);
          if (currentId > 9 && !isRightEdge) clickNeighbor(currentId, 1 - width);
          if (currentId > 10) clickNeighbor(currentId, -width);
          if (currentId > 11 && !isLeftEdge) clickNeighbor(currentId, -1 - width);
          if (currentId < 99 && !isRightEdge) clickNeighbor(currentId, 1);
          if (currentId < 90 && !isLeftEdge) clickNeighbor(currentId, -1 + width);
          if (currentId < 88 && !isRightEdge) clickNeighbor(currentId, 1 + width);
          if (currentId < 89) clickNeighbor(currentId, width);
      }, 10);
  }

  function clickNeighbor(currentId, offset) {
      const newId = parseInt(currentId) + offset;
      const newSquare = document.getElementById(newId);
      if (newSquare) click(newSquare);
  }

  function checkForWin() {
      let matches = 0;
      for (let i = 0; i < squares.length; i++) {
          if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
              matches++;
          }
          if (matches === bombAmount) {
              result.innerHTML = 'YOU WIN!';
              isGameOver = true;
          }
      }
  }

  function gameOver() {
      result.innerHTML = "BOOM! GameOver!";
      isGameOver = true;

      squares.forEach(function (square) {
          if (square.classList.contains("bomb")) {
              square.innerHTML = "💣";
              square.classList.remove("bomb");
              square.classList.add("checked");
          }
      });
  }

  createBoard();
});
