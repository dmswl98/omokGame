const $intro = document.querySelector('.game-intro');
const $startBtn = document.querySelectorAll('.start-button');
const $ruleBtn = document.querySelector('.rule-button');
const $rule = document.querySelector('.game-rule');
const $table = document.querySelector('.table');
const $turn = document.querySelector('.turn');
const $alert = document.querySelector('.alert');
const $winner = document.querySelector('.winner');
const $restart = document.querySelector('.restart');
const $reload = document.querySelector('.reload');

let size = 15;

window.onload = function () {
  $alert.style.display = 'none';
  $rule.style.display = 'none';
  $turn.style.display = 'none';
}

$startBtn.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    $intro.style.display = 'none';
    $rule.style.display = 'none';
    $turn.style.display = 'block';
  })
});

$ruleBtn.addEventListener('click', () => {
  $intro.style.display = 'none';
  $rule.style.display = 'flex';
});

let order = true; //true(black), false(white)
let data = Array.from(Array(size), () => Array(size).fill(0));
let isclicked = false;

function drawTable() {
  for (let i = 0; i < size; i++) {
    const $tr = document.createElement('tr');
    for (let j = 0; j < size; j++) {
      const $td = document.createElement('td');

      if (i === 0) {
        if (j === 0) {
          $td.classList.add('left-top');
        }
        else if (j > 0 && j < size - 1) {
          $td.classList.add('top');
        }
        else if (j === size - 1) {
          $td.classList.add('right-top');
        }
      }
      else if (i > 0 && i < size - 1) {
        if (j === 0) {
          $td.classList.add('left');
        }
        else if (j > 0 && j < size - 1) {
          $td.classList.add('default');
        }
        else if (j === size - 1) {
          $td.classList.add('right');
        }
      }
      else if (i === size - 1) {
        if (j === 0) {
          $td.classList.add('left-bottom');
        }
        else if (j > 0 && j < size - 1) {
          $td.classList.add('bottom');
        }
        else if (j === size - 1) {
          $td.classList.add('right-bottom');
        }
      }
      $tr.append($td);
    }
    $table.append($tr);
    $table.addEventListener('click', onClickBlock);
  }
}

function onClickBlock(e) {
  const clicked = e.target;
  const rowIndex = clicked.parentNode.rowIndex; //tr의 rowIndex
  const cellIndex = clicked.cellIndex; //td의 cellIndex
  // console.log(clicked, rowIndex, cellIndex);
  
  let cellData = data[rowIndex][cellIndex];
  if (cellData) return;

  if (order) {
    data[rowIndex][cellIndex] = 1; //black
    clicked.classList.add('black');
    order = false;
    check(rowIndex, cellIndex);
  }
  else if (!order) {
    data[rowIndex][cellIndex] = 2; //white
    clicked.classList.add('white');
    order = true;
    check(rowIndex, cellIndex);
  }
  turn(order);
  //console.log(data);
}

function check(x, y) {
  let winner;

  //가로
  data.forEach((row, i) => {
    let checkRow = row.join('');
    if (checkRow.includes('1'.repeat(5))) {
      winner = 'black';
      gameOver(winner);
    }
    else if (checkRow.includes('2'.repeat(5))) {
      winner = 'white';
      gameOver(winner);
    }
  });

  //세로
  data.forEach((row, i) => {
    let checkCol = [];
    row.forEach((col, j) => {
      checkCol.push(data[j][i]);
    });
    if (checkCol.join('').includes('1'.repeat(5))) {
      winner = 'black';
      gameOver(winner);
    }
    else if (checkCol.join('').includes('2'.repeat(5))) {
      winner = 'white';
      gameOver(winner);
    }
  });
  //console.log(data);

  //대각선 아래(black)
  let rowIndex = x;
  let colIndex = y;
  let checkBlackDownCross = [];
  let checkWhiteDownCross = [];

  if (data[x][y] === 1) { //black
    checkBlackDownCross.push(data[x][y]);
    while (rowIndex < size - 1 && colIndex < size - 1) {
      rowIndex++;
      colIndex++;
      checkBlackDownCross.push(data[rowIndex][colIndex]);
    }

    rowIndex = x;
    colIndex = y;

    while (rowIndex > 0 && colIndex > 0) {
      rowIndex--;
      colIndex--;
      checkBlackDownCross.unshift(data[rowIndex][colIndex]);
    }
  }
  else if (data[x][y] === 2) { //white
    checkWhiteDownCross.push(data[x][y]);
    while (rowIndex < size - 1 && colIndex < size - 1) {
      rowIndex++;
      colIndex++;
      checkWhiteDownCross.push(data[rowIndex][colIndex]);
    }

    rowIndex = x;
    colIndex = y;

    while (rowIndex > 0 && colIndex > 0) {
      rowIndex--;
      colIndex--;
      checkWhiteDownCross.unshift(data[rowIndex][colIndex]);
    }
  }

  // console.log('black down', checkBlackDownCross);
  // console.log('white down', checkWhiteDownCross);
  
  if (checkBlackDownCross.join('').includes('1'.repeat(5))) {
    winner = 'black';
    gameOver(winner);
  }
  if (checkWhiteDownCross.join('').includes('2'.repeat(5))) {
    winner = 'white';
    gameOver(winner);
  }

  //대각선 위(black)
  rowIndex = x;
  colIndex = y;
  let checkBlackUpCross = [];
  let checkWhiteUpCross = [];
  
  if (data[x][y] === 1) {
    checkBlackUpCross.push(data[x][y]);
    while (rowIndex > 0 && colIndex < size - 1) {
      rowIndex--;
      colIndex++;
      checkBlackUpCross.push(data[rowIndex][colIndex]);
    }

    rowIndex = x;
    colIndex = y;
    
    while (rowIndex < size - 1 && colIndex > 0) {
      rowIndex++;
      colIndex--;
      checkBlackUpCross.unshift(data[rowIndex][colIndex]);
    }
  }
  else if (data[x][y] === 2) {
    checkWhiteUpCross.push(data[x][y]);
    while (rowIndex > 0 && colIndex < size - 1) {
      rowIndex--;
      colIndex++;
      checkWhiteUpCross.push(data[rowIndex][colIndex]);
    }

    rowIndex = x;
    colIndex = y;
    
    while (rowIndex < size - 1 && colIndex > 0) {
      rowIndex++;
      colIndex--;
      checkWhiteUpCross.unshift(data[rowIndex][colIndex]);
    }
  }

  // console.log('black up', checkBlackUpCross);
  // console.log('white up', checkWhiteUpCross);
  
  if (checkBlackUpCross.join('').includes('1'.repeat(5))) {
    winner = 'black';
    gameOver(winner);
  }
  if (checkWhiteUpCross.join('').includes('2'.repeat(5))) {
    winner = 'white';
    gameOver(winner);
  }
}

function gameOver(winner) {
  $table.removeEventListener('click', onClickBlock);

  $alert.style.display = 'flex';
  $winner.textContent = winner;
}

function turn(order) {
  const $turnImg = $turn.querySelector('.turn-img');
  if (order) {
    $turnImg.innerHTML = '<img src="./images/black.png" alt="black">';
  }
  else {
    $turnImg.innerHTML = '<img src="./images/white.png" alt="white">';
  }
}

$restart.addEventListener('click', (e) => {
  data = Array.from(Array(size), () => Array(size).fill(0));
  $table.innerHTML = '';
  drawTable();
  $alert.style.display = 'none';
});

$reload.addEventListener('click', (e) => {
  window.location.reload();
});

drawTable();