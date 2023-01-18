const canvas = document.querySelector('canvas');
const scoreCount = document.querySelector('.score');
const scoregame = document.querySelector('.scoregame');
const restartgame = document.querySelector('.restartgame');
const up = document.querySelector('#up');
const left = document.querySelector('#left');
const right = document.querySelector('#right');
const down = document.querySelector('#down');
const ctx = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const snakeParts = [];
let tailLength = 2;

const col = 30 ;
const row = 20;

let speed = 6;

const width = canvas.width = 20 * col;
const height = canvas.height = 20 * row;

let tileCount = 20;
let tileSize = 18;

let headX = 1;
let headY = 1;

let appleX = 5;
let appleY = 5;

let pastScore = false;


let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const sound = new Audio("sound.mp3");
const soundHit = new Audio("hitsound.mp3");

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = "10px Verdana";
    ctx.fillText('Score ' + score, canvas.width-50, 10)
}

function drawGame() {
    changeSnakePosition();
    let result = isGameOver();

    if(result) {
        return;
    }
    clearScreen();
    // drawScore();

    if(score > 4) {
        speed = 8;
    }

    if(score > 10) {
        speed = 13;
    }


    checkAppleCollision();
    drawSnake();
    drawApple();
    setTimeout(drawGame, 1000/speed);
}

function isGameOver() {
    let gameOver = false;

    if(xVelocity === 0 && yVelocity === 0) {
        return false;
    }

    //walls
    if(headX < 0) {
        gameOver = true;
        soundHit.play();
    } else if(headX === 30) {
        gameOver = true;
        soundHit.play();
    } else if(headY < 0){
        gameOver = true;
        soundHit.play();
    } else if(headY === 20) {
        gameOver = true;
        soundHit.play();
    }

    for(let i=0; i<snakeParts.length; i++) {
        let part = snakeParts[i];
        if(part.x == headX && part.y == headY) {
            gameOver = true;
            break;
        }
    }

    if(gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = "50px verdana";
        ctx.fillText("Game Over", canvas.width/4, canvas.height/2);
       
        scoregame.innerHTML = "You score "+ score;
        restartgame.setAttribute("class","active");
        restartgame.addEventListener("click", ()=>{
            location.reload();
        })
        
    }

    return gameOver;
}

function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, width, height);
}

function drawSnake() {
   
    ctx.fillStyle = 'white';
    for(let i=0; i<snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x*tileCount, part.y*tileCount, tileSize, tileSize);
    }

    snakeParts.push(new SnakePart(headX, headY));
    if(snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX*tileCount, headY*tileCount, tileSize, tileSize )
}

function drawApple() {
    ctx.fillStyle = "red";
   
    ctx.fillRect(appleX*tileCount, appleY*tileCount, tileSize, tileSize);

}

function checkAppleCollision() {
    
    if(appleX === headX && appleY === headY) {
        scoreCount.innerHTML = "SCORE: "+ ++score;
        tailLength++;
        sound.play();
        pastScore = true;
      
       
        setTimeout(() => {
           
            appleX = Math.floor(Math.random()*tileCount);
        appleY = Math.floor(Math.random()*tileCount);
            
            sound.pause();
            sound.currentTime = 0;
        }, 300);

    } 
   
       
    
}

if(appleX !== headX && appleY !== headY && pastScore ) {

    setInterval(() => {
        appleX = Math.floor(Math.random()*tileCount);
        appleY = Math.floor(Math.random()*tileCount);
    }, 10000);
  

}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}


up.addEventListener('click', () => {
    if(yVelocity == 1) return;
    yVelocity = -1;
    xVelocity = 0;
})

left.addEventListener('click', () => {
    if(xVelocity == 1) return;
    yVelocity = 0;
    xVelocity = -1;
})

right.addEventListener('click', () => {
    if(xVelocity == -1) return;
    yVelocity = 0;
    xVelocity = 1;
})

down.addEventListener('click', () => {
    if(yVelocity == -1) return;
        yVelocity = 1;
        xVelocity = 0;
})

document.body.addEventListener('keydown', KeyPress);

function KeyPress(e) {
    //UP
    if(e.keyCode == 38) {
        if(yVelocity == 1) return;
        yVelocity = -1;
        xVelocity = 0;
    }

    //DOWN
    if(e.keyCode == 40) {
        if(yVelocity == -1) return;
        yVelocity = 1;
        xVelocity = 0;
    }

     //LEFT
     if(e.keyCode == 37) {
        if(xVelocity == 1) return;
        yVelocity = 0;
        xVelocity = -1;
    }

     //RIGHT
     if(e.keyCode == 39) {
        if(xVelocity == -1) return;
        yVelocity = 0;
        xVelocity = 1;
    }
}

drawGame();