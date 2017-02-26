var canvas = document.getElementById("main"); //get canvas to the variable
var context = canvas.getContext("2d"); //define context of the canvas

//frame elements
var frame;
var frameInterval;
var wCanvas = canvas.width;
var hCanvas = canvas.height;
var paddleHeight = 75;
var paddleWidth = 10;
var ballRadius = 10;
var LP_y, RP_y, LP_x, RP_x;//paddle possitioning variables
var paddleMoveSpeed = 3;
var ball_x, ball_y;
var ballMoveSpeed = 2;
var ballMoveX;
var ballMoveY;
var left_score;
var right_score;
var collition_detec = ballRadius + paddleWidth;
var luckLength = 8;
var winScore = 5;

//keyHandlers
var leftUp = false;
var leftDown = false;
var rightUp = false;
var rightDown = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler (e) {
    if (e.keyCode == 38) {
        rightUp = true;
    }
    if (e.keyCode == 40) {
        rightDown = true;
    }
    if (e.keyCode == 87) {
        leftUp = true;
    }
    if (e.keyCode == 83) {
        leftDown = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 38) {
        rightUp = false;
    }
    if (e.keyCode == 40) {
        rightDown = false;
    }
    if (e.keyCode == 87) {
        leftUp = false;
    }
    if (e.keyCode == 83) {
        leftDown = false;
    }
}

//paddles drawing function
function paddlesDraw() {
    context.beginPath();
    context.rect(LP_x, LP_y, paddleWidth, paddleHeight);
    context.rect(RP_x, RP_y, paddleWidth, paddleHeight);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
}

// ball drawing function
function ballDraw() {
    context.beginPath();
    context.arc(ball_x, ball_y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "white";
    context.fill();
    context.closePath();
}

function scoreDraw() {
    context.font = "16px Arial";
    context.fillStyle = "white";
    context.fillText("Score: " + left_score, 8, 20);
    context.fillText("Score: " + right_score, wCanvas - 65, 20);
}

//move paddle
function movePaddles () {
    if (leftUp) {
        if (LP_y >= paddleMoveSpeed)
            LP_y -= paddleMoveSpeed;
        else
            LP_y = 0;
    }
    if (rightUp) {
        if (RP_y >= paddleMoveSpeed)
            RP_y -= paddleMoveSpeed;
        else
            RP_y = 0;
    }
    if (leftDown) {
        if (LP_y <= (hCanvas - (paddleHeight + paddleMoveSpeed)))
            LP_y += paddleMoveSpeed;
        else
            LP_y = hCanvas - paddleHeight;
    }
    if (rightDown) {
        if (RP_y <= (hCanvas - (paddleHeight + paddleMoveSpeed)))
            RP_y += paddleMoveSpeed;
        else
            RP_y = hCanvas - paddleHeight;
    }
}

//move ball
function moveBall() {
    ball_x += ballMoveX;
    ball_y += ballMoveY;
}

//change possition
function move() {
    movePaddles();
    moveBall();
}

function veloChange(side) {
    if (side == "L") {
        if (leftUp) {
            if (ballMoveY < 0)
                ballMoveY = 0;
            else
                ballMoveY = 2;
        } else if (leftDown) {
            if (ballMoveY > 0)
                ballMoveY = 0;
            else
                ballMoveY = -2;
        }
    } else {
        if (rightUp) {
            if (ballMoveY < 0)
                ballMoveY = 0;
            else
                ballMoveY = 2;
        } else if (rightDown) {
            if (ballMoveY > 0)
                ballMoveY = 0;
            else
                ballMoveY = -2;
        }
    }
    ballMoveX = -ballMoveX;
}

function collition() {
    if (ball_x <= collition_detec) {
        if ((ball_y >= LP_y - luckLength) && (ball_y <= (LP_y + paddleHeight + luckLength))) {
            veloChange("L")
        } else {
            clearInterval(frame);
            right_score++;
            ball_x = Math.round(wCanvas / 4);
            ball_y = Math.round(hCanvas / 2);
            ballMoveX = ballMoveSpeed;
            ballMoveY = 0;
            if (right_score > winScore) {
                win("R");
                return;
            }
            frame = setInterval(draw, frameInterval)
        }
    } else if (ball_x >= (wCanvas - collition_detec)) {
        if ((ball_y >= RP_y - luckLength) && (ball_y <= (RP_y + paddleHeight + luckLength))) {
            veloChange("R")
        } else {
            clearInterval(frame);
            left_score++;
            ball_x = Math.round(wCanvas * 3 / 4);
            ball_y = Math.round(hCanvas / 2);
            ballMoveX = -ballMoveSpeed;
            ballMoveY = 0;
            if (left_score > winScore) {
                win("L");
                return;
            }
            frame = setInterval(draw, frameInterval)
        }
    }
    if ((ball_y <= ballRadius) || (ball_y >= (hCanvas - ballRadius))) {
        ballMoveY = -ballMoveY;
    }
}

function win(side) {
    clearInterval(frame);
    context.clearRect(0, 0, wCanvas, hCanvas);
    if (side == "R") {
        context.font = "48px Arial";
        context.fillStyle = "green";
        context.fillText("WIN RIGHT SIDE", wCanvas/2 - 175, hCanvas/2 -24);
    } else {
        context.font = "48px Arial";
        context.fillStyle = "green";
        context.fillText("WIN LEFT SIDE", wCanvas / 2 - 180, hCanvas / 2 - 24);
    }
}

//drawing function
function draw() {
    context.clearRect(0, 0, wCanvas, hCanvas);
    paddlesDraw();
    ballDraw();
    scoreDraw();
    collition();
    move();
}

function init() {
    frameInterval = 7;
    LP_y = Math.round((hCanvas / 2) - (paddleHeight / 2));
    RP_y = LP_y;
    LP_x = 0;
    RP_x = wCanvas - paddleWidth;
    ball_x = Math.round(wCanvas / 4);
    ball_y = Math.round(hCanvas / 2);
    ballMoveX = ballMoveSpeed;
    ballMoveY = 0;
    left_score = 0;
    right_score = 0;
}

$(document).ready(function () {
    init();
    frame = setInterval(draw, frameInterval)
});