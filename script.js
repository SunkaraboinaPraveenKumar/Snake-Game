//define html elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text')
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
//game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameSpeedDelay = 200;
let gameStarted = false;


// setSpeed();
// function setSpeed() {
//     var levelChoosen = '';
//     document.getElementById('levels').addEventListener('change', function (event) {
//         levelChoosen = event.target.value;
//     });
//     if (levelChoosen === 'easy') {
//         if (gameSpeedDelay > 150) {
//             gameSpeedDelay -= 5;
//         }
//         else if (gameSpeedDelay > 100) {
//             gameSpeedDelay -= 3;
//         }
//         else if (gameSpeedDelay > 50) {
//             gameSpeedDelay -= 2;
//         }
//         else if (gameSpeedDelay > 25) {
//             gameSpeedDelay -= 1;
//         }
//         console.log(gameSpeedDelay);
//     }
//     else if (levelChoosen === 'medium') {
//         if (gameSpeedDelay > 150) {
//             gameSpeedDelay -= 10;
//         }
//         else if (gameSpeedDelay > 100) {
//             gameSpeedDelay -= 6;
//         }
//         else if (gameSpeedDelay > 50) {
//             gameSpeedDelay -= 4;
//         }
//         else if (gameSpeedDelay > 25) {
//             gameSpeedDelay -= 2;
//         }
//         console.log(gameSpeedDelay);
//     }
//     else if (levelChoosen === 'hard') {
//         if (gameSpeedDelay > 150) {
//             gameSpeedDelay -= 15;
//         }
//         else if (gameSpeedDelay > 100) {
//             gameSpeedDelay -= 9;
//         }
//         else if (gameSpeedDelay > 50) {
//             gameSpeedDelay -= 6;
//         }
//         else if (gameSpeedDelay > 25) {
//             gameSpeedDelay -= 3;
//         }
//         console.log(gameSpeedDelay);
//     }
// }
//Draw game map,snake,food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}
//create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//set the positon of snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


//draw food function
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}
//generate function for food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

//moving the snake
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        clearInterval(gameInterval);//clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop();
    }
    //snake.pop();
}
// test moving
// setInterval(()=>{
//     move();
//     draw();
// },200);

//start game function
function startGame() {
    gameStarted = true;//keep track of a running game
    increaseSpeed();
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//key press event listener
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'space') ||
        (!gameStarted && event.key === ' ')) {
        startGame();
    }
    else {
        increaseSpeed(); 
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);
//check collision function
function checkCollision() {
    const head = { ...snake[0] };
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}
function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    }
    else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }
    else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
    console.log(gameSpeedDelay);
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}