// Sekcja zmiennych globalnych
// --------------------------------------------------------------
var DESK_POSITION_Y = 475;
var BALL_MOVE_UP = 1;
var BALL_MOVE_DOWN = -1;
var BALL_STOPS = 0;
var BALL_MOVE_RIGHT = 1;
var BALL_MOVE_LEFT = -1;
var BRICK_WIDTH = 100;
var BRICK_HEIGHT = 20;
var canvas;
var ctx;
var ballDirectionVertically = BALL_MOVE_UP;
var ballDirectionHorizontally = BALL_MOVE_RIGHT;
var theBall;
var pointer;
var bricksArray;
// Sekcja obiektow
// --------------------------------------------------------------
function mouse() {
    this.x = 0;
    this.y = 0;
}
function ball(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}
function desk(width, height) {
    this.width = width;
    this.height = height;
}
function brick(x, y, destroyed) {
    this.x = x;
    this.y = y;
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;
    this.destroyed = destroyed;
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
    bricksArray = new Array(new brick(150, 10, false), new brick(150, 100, false),
            new brick(150, 450, false));
    // Zdarzenie poruszania myszki
    document.addEventListener('mousemove', function (e) {
        pointer.x = e.clientX || e.pageX;
        pointer.y = e.clientY || e.pageY
    }, false);
    // Petla rysujaca
    setInterval("draw()", 10);
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
            var ballBottomMargin = theBall.y + theBall.radius + theBall.radius;
            var ballRightMargin = theBall.x + theBall.radius + theBall.radius;

            var horizontalCollision = theBall.x > b.x && ballRightMargin < brickRightMargin;
            var verticalCollision = (theBall.y == brickBottomMargin) || (ballBottomMargin == b.y);


            // SPRAWDZANA JEST TYLKO KOLIZJA OD DOLU
            if (horizontalCollision && verticalCollision) {
                bricksArray[i].destroyed = true;

                if (ballDirectionVertically == BALL_MOVE_DOWN) {
                    ballDirectionVertically = BALL_MOVE_UP;
                } else if (ballDirectionVertically == BALL_MOVE_UP) {
                    ballDirectionVertically = BALL_MOVE_DOWN;
                }
            }
        }
    }
}
// sprawdzanie kolizji pilki horyzontalnie
function checkBallHorizontalCollisions() {
    var ballRightMargin = theBall.x + theBall.radius;

    if (ballRightMargin > canvas.width)
        ballDirectionHorizontally = BALL_MOVE_LEFT;
    else if (theBall.x == 0)
        ballDirectionHorizontally = BALL_MOVE_RIGHT;
}
// poruszanie pilki
function moveBall() {
    if (ballDirectionVertically == BALL_MOVE_UP)
        theBall.y -= 1;
    else if (ballDirectionVertically == BALL_MOVE_DOWN)
        theBall.y += 1;

    if (ballDirectionHorizontally == BALL_MOVE_RIGHT)
        theBall.x += 1;
    else if (ballDirectionHorizontally == BALL_MOVE_LEFT)
        theBall.x -= 1;
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
            ctx.fillStyle = "#00ff00";
            ctx.fillRect(b.x, b.y, b.width, b.height);
        }
    }
}
