var canvas = document.getElementById("main"); //get canvas to the variable
var context = canvas.getContext("2d"); //define context of the canvas

//time interval of frames
var frame;
var frame_Intervel;
var stage = 0;
var brick_data;

//define elments of canvas
var w = canvas.width;
var h = canvas.height;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (w - paddleWidth) / 2;
var ball_movement = 1;
var paddle_movement = 5;
var bricks = [];
function ini_bricks() {
    bricks = brick_data[stage][0];
}

//starting point 
var x = w/2;
var y = h - 30;
var score = 0;
var lives = 3;

//start gradiant values of ball
var dy = ball_movement;
var dx = ball_movement;

//bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//key handlers
var rightPressed = false;
var leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//key pressed
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

//key released
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

//mouse movement
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

//gradiant changing function
function gradiant() {
    if (x < 10) {
        dx = ball_movement;
    } else if (x > (w - ballRadius)) {
        dx = -ball_movement;
    }
    if (y < 10) {
        dy = ball_movement;
    } else if (y > (h - (ballRadius + paddleHeight))) {
        if ((x > (paddleX - 10)) && (x < (paddleX + paddleWidth + 10))) {
            dy = -ball_movement;
        } else {
            if (!lives) {
                clearInterval(frame);
                gameover();
            }
            else {
                x = paddleX + 30;
                y = h - 30;
                dx = ball_movement;
                dy = -ball_movement;
            }
            lives--;
        }
    }
}

//location changing function
function changeLocation() {
    x += dx;
    y += dy;

    if (rightPressed && ((paddleX+paddleWidth) < w)) {
        if ((paddleX + paddleWidth + paddle_movement) > w) {
            paddleX = w - paddleWidth;
        } else {
            paddleX += paddle_movement;
        }
    } else if (leftPressed && (paddleX > 0)) {
        if (paddleX < paddle_movement) {
            paddleX = 0
        } else {
            paddleX -= paddle_movement;
        }
    }
}

//ball drawing function
function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
}

//paddle draving function
function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, h - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "black";
    context.fill();
    context.closePath();
}

//bricks drawing function
function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "#0095DD";
                context.fill();
                context.closePath();
            }
        }
    }
}

//Stage drawing function
function drawStage() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Stage: " + (stage+1), w/2-15, 20);
}

//score drawing function
function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: " + score, 8, 20);
}

//lives drawing function
function drawLives() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Lives: " + lives, canvas.width - 65, 20);
}

//Draw Win
function win() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "32px Arial";
    context.fillStyle = "green";
    context.fillText("YOU WIN", w/2-75, h/2);
}

//Draw loss
function gameover() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "32px Arial";
    context.fillStyle = "red";
    context.fillText("GAME OVER", w / 2 - 100, h / 2);
}

//collision detection
function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    if (stage == 0)
                        score++;
                    else if (stage == 1)
                        score += 3;
                    if (score == brickRowCount * brickColumnCount) {
                        clearInterval(frame);
                        win();
                        if (stage == 0) {
                            stage = 1;
                            ini_bricks();
                            score = 0;
                            frame = setInterval(draw, frame_Intervel);
                        }
                    }
                }
            }
        }
    }
}

//main drawing function
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
    drawStage();
    gradiant();
    changeLocation();
}

$(document).ready(function () {
    $.get(".././data/game1_stages.json", function (loaded_data) {
        brick_data = loaded_data;
        ini_bricks();

        //trigger interval
        frame = setInterval(draw, frame_Intervel);
    });
});