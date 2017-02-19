var canvas = document.getElementById("main"); //get canvas to the variable
var context = canvas.getContext("2d"); //define context of the canvas

//elements
var frame;
var frameNo = 0;
var frameRate = 1;
var cWidth = canvas.width;
var cHeight = canvas.height;
var blockHeight = 20;
var blockWidth = 20;
var blockStartPos = Math.floor((cHeight / 2) - (blockHeight / 2));
var blockY = blockStartPos;
var newFrame = 150;
var obst = [];
var obMaxHight = 200;
var obMinHeight = 40;
var obMaxGap = 160;
var obMinGap = 45;
var obsticleWidth = 18;
var obsticle_move = 1;
var scoreDivider = 100;

//key handlers
var up = false;
var down = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//key pressed
function keyDownHandler(e) {
    if (e.keyCode == 38) {
        up = true;
    } else if (e.keyCode == 40) {
        down = true;
    }
}

//key released
function keyUpHandler(e) {
    if (e.keyCode == 38) {
        up = false;
    } else if (e.keyCode == 40) {
        down = false;
    }
}

//change oblsticles
function moveObsticles() {
    var newObst = [];
    for (var i = 0; i < obst.length; i++) {
        obst[i][2] -= obsticle_move;
        if (obst[i][2] > -obsticleWidth)
            newObst.push(obst[i]);
    }
    obst = newObst;
}

//change block position
function move() {
    if (up) {
        if (blockY >= 3)
            blockY -= 3;
        else if (blockY < 3)
            blockY = 0;
    }
    if (down) {
        if (blockY < (cHeight - blockHeight - 3))
            blockY += 3;
        else if (blockY >= (cHeight - blockHeight - 3))
            blockY = cHeight - blockHeight;
    }
    moveObsticles();
    frameNo += frameRate;
}

//gameoer function
function gameover() {
    context.clearRect(0, 0, cWidth, cHeight);
    context.beginPath();
    context.rect(0, blockY, blockWidth, blockHeight);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();

    for (var i = 0; i < obst.length; i++) {
        if ((obst[i][2] <= blockWidth) || ((blockY + blockHeight) >= (obst[i][0] + obst[i][1]))) {
            context.beginPath();
            context.rect(obst[i][2], 0, obsticleWidth, obst[i][0]);
            context.rect(obst[i][2], (obst[i][0] + obst[i][1]), obsticleWidth, (cHeight - (obst[i][0] + obst[i][1])));
            context.fillStyle = "red";
            context.fill();
            context.closePath();
        } else {
            context.beginPath();
            context.rect(obst[i][2], 0, obsticleWidth, obst[i][0]);
            context.rect(obst[i][2], (obst[i][0] + obst[i][1]), obsticleWidth, (cHeight - (obst[i][0] + obst[i][1])));
            context.fillStyle = "black";
            context.fill();
            context.closePath();
        }
    }

    context.font = "40px Arial";
    context.fillStyle = "red";
    context.fillText("GAME OVER", cWidth / 2 - 120, cHeight / 2 - 40);
}

//function crash
function crash() {
    for (var i = 0; i < obst.length; i++) {
        if (obst[i][2] <= blockWidth) {
            if (blockY <= obst[i][0]) {
                clearInterval(frame);
                gameover();
            }
            else if ((blockY + blockHeight) >= (obst[i][0] + obst[i][1])) {
                clearInterval(frame);
                gameover();
            }
        }
    }
}

//drawing the block
function drawBlock() {
    context.beginPath();
    context.rect(0, blockY, blockWidth, blockHeight);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
}

//drawing the obsticles
function drawObsticles() {
    if ((Math.floor(frameNo) % newFrame) == 0) {
        var gap = Math.floor(Math.random() * (obMaxGap - obMinGap)) + obMinGap;
        var obHeight = Math.floor(Math.random() * (obMaxHight - obMinHeight)) + obMinHeight;
        obst.push([obHeight, gap, cWidth]);
    }
    for (var i = 0; i < obst.length; i++) {
        context.beginPath();
        context.rect(obst[i][2], 0, obsticleWidth, obst[i][0]);
        context.rect(obst[i][2], (obst[i][0] + obst[i][1]), obsticleWidth, (cHeight - (obst[i][0] + obst[i][1])));
        context.fillStyle = "black";
        context.fill();
        context.closePath();
    }
}

//drawing score
function score() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: " + Math.floor(frameNo / scoreDivider), 8, 20);

    if ((Math.floor(frameNo) % 1500) == 0) {
        frameRate *= 1.1;
    }
}

//main draw function
function draw() {
    context.clearRect(0, 0, cWidth, cHeight);
    drawBlock();
    drawObsticles();
    crash();
    score();
    move();
    moveObsticles();
}

$(document).ready(function () {
    frame = setInterval(draw, 10);
});