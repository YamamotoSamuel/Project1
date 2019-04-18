var canvas = document.getElementById('cvs');
var context = canvas.getContext('2d');
var score = 0

var grid = 20;
var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};
var count = 0;
var apple = {
  x: 320,
  y: 320
};

let obs = {
  x:19,
  y:20,
  width:19,
  height:20
}

let arrayObstacles = [
  obs
]

let w = 20;
let h = 20; 
setInterval(()=>{
  let obs = {
    x:Math.round(Math.random()*700 / 20) * 20,
    y:Math.round(Math.random()*700 / 20) * 20,
    width:w,
    height:h
  } 
  console.log(obs)
  arrayObstacles.push(obs)
},1000)

let seconds = 9;
let timer = setInterval(function(){
  seconds--;
  document.getElementById('timer').innerText = seconds;
  console.log(seconds);
  if(seconds < 0){
    document.getElementById('timer').innerText = 0;
    console.log('hello')
    
    if (confirm("You Ran Out of Time! You Scored "+ score)){
      txt = "Press Okay to Restart";
      location.reload();
    }else{
      location.reload();;
    }
    
    clearInterval(timer);
  }
},1000)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
  requestAnimationFrame(loop);

  // slow game loop to 15 fps instead of 60 - 60/15 = 4 //////// *4*
  if (++count < 5) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrap snake position on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of array is the head
  snake.cells.unshift({x: snake.x, y: snake.y, height:20, width:20});

  // remove cells as snake moves away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  
  // draw apple
  context.fillStyle = 'red';
  apple.x = apple.x + 5
  context.fillRect(apple.x, apple.y, grid-1, grid-1);
  

  // draw snake
  snake.cells.forEach(function(cell, index) {
    context.fillStyle = 'black';

    context.fillRect(cell.x, cell.y, grid-1, grid-1);
  
    arrayObstacles.forEach((obs, i)=>{
      //console.log(obs)
      context.fillStyle = 'red';
      obs.x++
      obs.y++
      context.fillRect(obs.x, obs.y, obs.width, obs.height);

    if (cell.x < obs.x + obs.width && //When snake hits a red square 
      cell.x + cell.width > obs.x &&
      cell.y < obs.y + obs.height &&
      cell.y + cell.height > obs.y) {
       // collision detected!
        arrayObstacles.splice(i,1)
        seconds = 10;
        snake.maxCells++;
        score++
        document.getElementById("score").innerHTML = score
        if(score === 10){
          document.getElementById("cvs").style.animation = 'flash 1s linear infinite'
        }
        if(score === 30){
          document.getElementById("cvs").style.animation = 'spin 60s linear infinite'
        }
    }
    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      seconds = 10;
      snake.maxCells++;
      score++
      document.getElementById("score").innerHTML = score

      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
  })

    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {
      
      // collision. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        alert(score + "? Ehh, I've seen better... Click 'OK' or Press 'Enter' to Play Again!");
        location.reload();

        seconds = 9; 
        score = 0;
        document.getElementById("score").innerHTML = score
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}

var allowedTime = 200;
var startX = 0;
var startY = 0;

document.addEventListener('touchstart', function(e){
    var touch = e.changedTouches[0]
    startX = touch.pageX
    startY = touch.pageY
    startTime = new Date().getTime()
    e.preventDefault()
}, false)

document.addEventListener('touchmove', function(e){
    e.preventDefault()
}, false)

document.addEventListener('touchend', function(e){
    var touch = e.changedTouches[0]
    distX = touch.pageX - startX
    distY = touch.pageY - startY

    if (Math.abs(distX) > Math.abs(distY)) {
      if (distX > 0 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
        console.log("Stop hitting yourself")
      }
      else if (distX < 0 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
        console.log("Stop hitting yourself")

      }
    } else {
      if (distY > 0 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
        console.log("Stop hitting yourself")

      }
      else if (distY < 0 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
        console.log("Stop hitting yourself")

      }
    }
    e.preventDefault();

}, false)

document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

requestAnimationFrame(loop);