window.addEventListener('load', main);

var home = document.getElementById('home');
var end = document.getElementById('end');
var game = document.getElementById('game');
var winner = document.getElementById('winner');

var ctx = game.getContext('2d');
game.height = 500;
game.width = 700;
var rains = [];

var bg = new Image()
bg.src = 'image/bg.jpg'

var play;
var dPlayer = {
    name: '',
    x: game.width/2+50,
    y: game.height - 100,
    w: 50,
    h: 50,
    color: 'transparent',
    fcolor: '#5454c5',
    lwidth: '3'
}
var player = {
    name: '',
    x: game.width/2+50,
    y: game.height - 100,
    w: 50,
    h: 50,
    color: 'transparent',
    fcolor: '#5454c5',
    lwidth: '3'
}
var dEnemy = {
    name: '',
    x: game.width/2-50,
    y: game.height-100,
    w: 50,
    h: 50,
    color: 'transparent',
    fcolor: '#220e24',
    lwidth: '3'
}
var enemy = {
    name: '',
    x: game.width/2-50,
    y: game.height-100,
    w: 50,
    h: 50,
    color: 'transparent',
    fcolor: '#220e24',
    lwidth: '3'
}
class Rain {
    constructor(game) {
        this.game = game;
        this.x = Math.floor( Math.random() * (this.game.width+50)) + 5;
        this.xt = this.x-2;
        this.startY = -25;
        this.y = this.startY;
        this.yt = this.y + 25;
    }
    update() {
        this.y += 0.7;
        this.yt = this.y + 25;
        this.x -=0.1;
        this.xt =this.x-2;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.xt, this.yt);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }
}

// main function
function main()
{
    home.style.display = 'flex';
    game.style.display = 'none';
    end.style.display = 'none';
}
function init(e)
{
    dPlayer.name = document.getElementById('enemy_name').value;
    player.name = dPlayer.name;
    dEnemy.name = document.getElementById('player_name').value;
    enemy.name = dEnemy.name;
    home.style.display = 'none';
    end.style.display = 'none';
    game.style.display = 'block';
    document.addEventListener('keydown', keypress);
    drawRect(player.x, player.y, player.w, player.h, player.color, player.fcolor, player.lwidth)

    play = setInterval(update, 1);
}
function clearGame() {
    rains = [];
    player = dPlayer;
    enemy = dEnemy;
}
function update()
{
    // background
    drawRectImg(bg, 0, 0, game.width, game.height, game.width*2, game.height*2);
    // player
    drawRectText(player.x, player.y, player.w, player.h, player.color, player.fcolor, player.lwidth, player.name)
    // enemy
    drawRectText(enemy.x, enemy.y, enemy.w, enemy.h, enemy.color, enemy.fcolor, enemy.lwidth, enemy.name)
    // rain
    rains.forEach(rain => {
        if(rain.y > game.height -80) rains.shift()
        rain.update()
        rain.draw(ctx);
    });
    addRain();
    checkCollision();
}
function addRain() {
    const rainTime = Math.floor(Math.random() * 100);
    if(rainTime <= 1) rains.push(new Rain(game))
}
function checkCollision() {
    rains.forEach(rain => {
        if( rain.yt > player.y && (rain.x < player.x+player.w && rain.x > player.x) ) eWin()
        if( rain.yt > enemy.y && (rain.x < enemy.x+enemy.w && rain.x > enemy.x) ) pWin()
    })
}

function pWin() {
    end.style.display = 'grid';
    winner.innerHTML = player.name+' menang!';
    game.style.display = 'none';
    clearInterval(play)
    clearGame()
}
function eWin() {
    end.style.display = 'grid';
    winner.innerHTML = enemy.name+' menang!';
    game.style.display = 'none';
    clearInterval(play)
    clearGame();
}

// draw function
function drawText(text, x, y, color, size, font)
{
    ctx.font = size+' '+font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}
function drawLine(x, y, xt, yt, color, lwidth)
{
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xt, yt);
    ctx.strokeStyle = color;
    ctx.lineWidth = lwidth;
    ctx.stroke();
    ctx.closePath();
}
function drawRect(x, y, w, h, color, fcolor, lwidth)
{
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = fcolor;
    ctx.lineWidth = lwidth;
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
}
function drawRectText(x, y, w, h, color, fcolor, lwidth, text)
{
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = fcolor;
    ctx.lineWidth = lwidth;
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(x, y, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseLine = 'middle';
    ctx.fillStyle = "white"
    ctx.fillText(text, x+(w/2),y+(h/2));

    ctx.closePath();
}

function drawCircle(x, y, radius, sAngle, eAngle, color, fcolor, lwidth)
{
    ctx.beginPath();
    ctx.arc(x, y, radius, sAngle, eAngle);
    ctx.strokeStyle = color;
    ctx.fillStyle = fcolor;
    ctx.lineWidth = lwidth;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}
function drawRectImg(img, x, y, w, h, sw, sh)
{
    ctx.drawImage(img, x, y, sw, sh, x, y, w, h);
}
function drawRoundImg(img, x, y, radius)
{
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.stroke();
    ctx.fill();
    ctx.clip();
    ctx.drawImage(img, x-radius, y-radius, 2*radius, 2*radius);
    ctx.restore();
}

// controller
function keypress(e)
{
    if(e.code === 'ArrowLeft' && !(player.x <= 10)) player.x -= 10;
    if(e.code === 'ArrowRight' && !(player.x+player.w >= game.width-10)) player.x += 10;
    if(e.code === 'KeyA' && !(enemy.x <= 10)) enemy.x -= 10;
    if(e.code === 'KeyD' && !(enemy.x+enemy.w >= game.width-10)) enemy.x += 10;
}