document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector(".grid");
  const width = 10;
  const flagsLeft = document.querySelector("#flags-left");
  const result = document.querySelector("#result");
  let bombAmount = 20;
  let squares = [];
  let isGameOver = false;
  let flags =0;

  function createBoard() {
    //تعداد بمب
    flagsLeft.innerHTML = bombAmount;
    //تشخیص بمب و اصلی
    const bombArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    //تشکیل مربع های کوچک
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.id = i;
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);
      //کلیک عادی
      square.addEventListener("click", function () {
        click(square);
      });

      //راست کلیک
      square.addEventListener("contextmenu", function () {
        addFlag(square)
      });
    }
    //عدد تعداد بمب
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains("valid")) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++; //چپ
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++; //بالا راست
        if (i > 10 && squares[i - width].classList.contains("bomb")) total++; //بالا
        if (
          i > 11 &&
          !isLeftEdge &&
          squares[i - width - 1].classList.contains("bomb")
        )
          total++; //بالا چپ
        if (i < 99 && !isRightEdge && squares[i + 1].classList.contains("bomb"))
          total++; //راست
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++; //پایین چپ
        if (
          i < 88 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++; //پایین راست
        if (i < 89 && squares[i + width].classList.contains("bomb")) total++; //پایین
        squares[i].setAttribute("data", total);
      }
    }
  }
  createBoard();

  function addFlag(square){
    if(isGameOver)return
    if(!square.classList.contains('checked') && (flags < bombAmount)){
        if(!square.classList.contains('flag')){
            square.classList.add('flag')
            flags++
            square.innerHTML ='🚩'
            flagsLeft.innerHTML = bombAmount - flags
            checkForWin()
        }else{
            square.classList.remove('flag')
            flags--
            square.innerHTML =''
            flagsLeft.innerHTML = bombAmount - flags
        }
    }
  }


  function click(square) {
    console.log(square);
    if (
      isGameOver ||
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
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
        return
      }
      checkSquare(square);
    }
    square.classList.add("checked");
  }
  //همسایه ها
  function checkSquare(square) {
    const currentId =square.id
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);

    setTimeout(function() {
        if(currentId > 0 && !isLeftEdge){
            const newId =parseInt(currentId) -1
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId > 9 && !isRightEdge){
            const newId =parseInt(currentId) +1 -width
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId > 10){
            const newId =parseInt(currentId) -width
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId > 11 && !isLeftEdge){
            const newId =parseInt(currentId) -1 -width
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId <98 && !isRightEdge){
            const newId =parseInt(currentId) +1
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId < 90 && !isLeftEdge){
            const newId =parseInt(currentId) -1
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId < 88 && !isRightEdge){
            const newId =parseInt(currentId) +1 +width
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId <89){
            const newId =parseInt(currentId) +width
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
    } , 10)
  }

  function checkForWin(){
    let matches =0
    for (let i = 0; i < squares.length; i++) {
        if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
            matches++

        }
        if(matches === bombAmount){
            result.innerHTML = 'YOU WIN!'
            isGameOver =true
        }
    }
  }

  function gameOver() {
    result.innerHTML = "BOOM! GameOver!";
    isGameOver = true;
    //نماش بمب ها
    squares.forEach(function (square) {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
        square.classList.remove("bomb");
        square.classList.add("checked");
      }
    });
  }
});
