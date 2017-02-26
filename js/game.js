// Sekcja zmiennych globalnych
// --------------------------------------------------------------
var DESK_POSITION_Y = 475;
var BALL_MOVE_UP = 1;
var BALL_MOVE_DOWN = -1;
var BALL_STOPS = -2;
var BALL_MOVE_RIGHT = 1;
var BALL_MOVE_LEFT = -1;
var BRICK_WIDTH = 100;
var BRICK_HEIGHT = 50;
var SPLIT = 10;
var canvas;
var ctx;
var ballDirectionVertically = 0;
var ballDirectionHorizontally = 0;
var theBall;
var pointer;
var bricksArray;
var brickColors;
// Sekcja obiektow
// --------------------------------------------------------------
function mouse() {
    this.x = 0;
    this.y = 0;
}
function ballRect(x, y, size) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
}
function ball(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.ballRect = new ballRect(this.x - this.radius, this.y - this.radius, this.radius + this.radius);
}
function desk(width, height) {
    this.width = width;
    this.height = height;
}
function brick(x, y, color, destroyed) {
    this.x = x;
    this.y = y;
    this.width = BRICK_WIDTH - SPLIT;
    this.height = BRICK_HEIGHT - SPLIT;
    this.destroyed = destroyed;
    this.color = color;
}
// Sekcja funkcji startujacej
// --------------------------------------------------------------
document.addEventListener('DOMContentLoaded', domloaded, false);

function domloaded() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    theBall = new ball(200, 400, 15);
    pointer = new mouse();
    theDesk = new desk(100, 10);
    brickColors = ["#3d82ab", "#ee5921", "#484848", "#3186ad", "#96c950", "#e6772e", "#e64a45", "#adb3b3"];
    initBricks();
    // Zdarzenie poruszania myszki
    document.addEventListener('mousemove', function (e) {
        pointer.x = e.clientX || e.pageX;
        pointer.y = e.clientY || e.pageY
    }, false);

    document.body.onmousedown = function() {
        if (ballDirectionVertically == 0 && ballDirectionHorizontally == 0) {
            ballDirectionVertically = BALL_MOVE_RIGHT;
            ballDirectionHorizontally = BALL_MOVE_UP;
        }
    }
    // Petla rysujaca
    setInterval("draw()", 15);
}
// Sekcja inicjalizacji wspolzednych cegielek
// --------------------------------------------------------------
function initBricks() {
    bricksArray = new Array();
    for (j = SPLIT; j < DESK_POSITION_Y - 300 ; j += BRICK_HEIGHT) {
        for ( i = SPLIT; i < canvas.width; i += BRICK_WIDTH) {
            color = brickColors[Math.floor(Math.random()*brickColors.length)];
            bricksArray.push(new brick(i,j,color,false));
        }
    }
}

// Sekcja funkcji rysujacej
// --------------------------------------------------------------
function draw() {
    // czyszczenie plotna 
    clear();
    // sprawdzanie kolizji paletki z ekranem
    checkDeskCollisions();
    // rysowanie pilki
    drawBall();
    // sprawdzanie kolizji pilki
    checkBallCollisionWithDesk();
    // poruszanie pilki
    moveBall();

    // rysowanie paletki 
    ctx.fillStyle = "#c82124"; //red
    ctx.fillRect(pointer.x, DESK_POSITION_Y, theDesk.width, theDesk.height);

    // rysowanie cegielek
    drawBricks();
    // sprawdzenie kolizji cegielek z pilka
    checkBallCollisionWithBrick();
    checkBallHorizontalCollisions();
}
// czyszczenie plotna 
function clear() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// sprawdzanie kolizji 'paletki' z krancami ekranu
function checkDeskCollisions() {
    var theDeskRightEdge = pointer.x + theDesk.width;
    var maxDeskXPosition = canvas.width - theDesk.width;

    if (pointer.x == 0)
        pointer.x = 0;
    else if (theDeskRightEdge > canvas.width)
        pointer.x = maxDeskXPosition;
}
// sprawdzanie kolizji pilki z deska
function checkBallCollisionWithDesk() {
    var ballTopMargin = theBall.y - theBall.radius;
    var ballBottomMargin = theBall.y + theBall.radius;
    var ballCenterPosition = theBall.x + theBall.radius;

    var checkBallAndDeskYCollision = ballBottomMargin == DESK_POSITION_Y;
    var checkBallAndDeskXCollision = ballCenterPosition > pointer.x && theBall.x < pointer.x + theDesk.width;
    var ballTouchDesk = checkBallAndDeskXCollision && checkBallAndDeskYCollision;

    if (ballTopMargin < 0)
        ballDirectionVertically = BALL_MOVE_DOWN;
    else if (checkBallAndDeskXCollision && checkBallAndDeskYCollision)
        ballDirectionVertically = BALL_MOVE_UP;
    else if (ballBottomMargin > canvas.height) {
        ballDirectionVertically = BALL_STOPS;
        ballDirectionHorizontally = BALL_STOPS;
    }
}
// sprawdzenie kolizji pilki z cegielkami
function checkBallCollisionWithBrick() {
    var b;
    for (i = 0; i < bricksArray.length; i++) {
        if (!bricksArray[i].destroyed)
            b = bricksArray[i];

        if (b != null) {

            var brickRightMargin = b.x + b.width;
            var brickBottomMargin = b.y + b.height;
            var ballBottomMargin = theBall.ballRect.y + theBall.ballRect.height ;
            var ballTopMargin = theBall.ballRect.y;
            var ballRightMargin = theBall.ballRect.x + theBall.ballRect.width;

            var verticalCollision = (ballTopMargin <= brickBottomMargin) && (ballBottomMargin >= b.y);
            var horizontalCollision = theBall.ballRect.x < b.x + b.width && theBall.ballRect.x + theBall.ballRect.width > b.x;
            var xx = 0;

            if (horizontalCollision && verticalCollision) {
                b.destroyed = true;
                xx++;

                //if (ballDirectionVertically == BALL_MOVE_DOWN) {
                //ballDirectionVertically = BALL_MOVE_UP;
                //} else if (ballDirectionVertically == BALL_MOVE_UP) {
                //ballDirectionVertically = BALL_MOVE_DOWN;
                //}
                if (xx % 2 == 0) {
                    ballDirectionVertically = BALL_MOVE_UP;
                } else {
                    ballDirectionVertically = BALL_MOVE_DOWN;
                }
            }
        }
    }
}
// sprawdzanie kolizji pilki horyzontalnie
function checkBallHorizontalCollisions() {
    var ballRightMargin = theBall.ballRect.x + theBall.ballRect.width;

    if (ballRightMargin > canvas.width)
        ballDirectionHorizontally = BALL_MOVE_LEFT;
    else if (theBall.ballRect.x == 0)
        ballDirectionHorizontally = BALL_MOVE_RIGHT;
}
// poruszanie pilki
function moveBall() {
    if (ballDirectionVertically == 0 && ballDirectionHorizontally == 0) {
        theBall.x = pointer.x + theDesk.width / 2;
        theBall.y = DESK_POSITION_Y - 14;
    } else {
        if (ballDirectionVertically == BALL_MOVE_UP) {
            theBall.y -= 1;
            theBall.ballRect.y = theBall.y - theBall.radius;
        }
        else if (ballDirectionVertically == BALL_MOVE_DOWN) {
            theBall.y += 1;
            theBall.ballRect.y = theBall.y - theBall.radius;
        }
        if (ballDirectionHorizontally == BALL_MOVE_RIGHT) {
            theBall.x += 1;
            theBall.ballRect.x = theBall.x - theBall.radius;
        }
        else if (ballDirectionHorizontally == BALL_MOVE_LEFT) {
            theBall.x -= 1;
            theBall.ballRect.x = theBall.x - theBall.radius;
        }
    }
}
// rysowanie pilki
function drawBall() {
    ctx.fillStyle = "#c82124"; //red
    ctx.beginPath();
    ctx.arc(theBall.x, theBall.y, theBall.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}
// rysowanie cegielek
function drawBricks() {
    for (i = 0; i < bricksArray.length; i++) {
        var b = bricksArray[i];

        if (!b.destroyed) {
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.width, b.height);
        }
    }
}
