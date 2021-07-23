var canvas;

var gameState = 0;
var playerCount = 0;

var database;

var allPlayers;
var distance = 0;

var form, player, game;

var car1,car2,car3,car4;
var cars; // array

var carImg1, carImg2, carImg3,carImg4;
var groundImg, trackImg;
var oilSpill,oilSpillImage;
var skidSound;

var passedFinish,finishedPlayers = 0;

var bronzeImg,silverImg,goldImg;

// initializing velocities
var xVel = 0;
var yVel = 0;

function preload(){
  carImg1 = loadImage("images/car1.png");
  carImg2 = loadImage("images/car2.png");
  carImg3 = loadImage("images/car3.png");
  carImg4 = loadImage("images/car4.png");

  groundImg = loadImage("images/ground.png");
  trackImg = loadImage("images/track.jpg");

  oilSpillImage = loadImage("images/f1.png");

  // load sound
  skidSound = loadSound("sound/sliding.mp3");

  // rank images
  bronzeImg = loadImage("images/bronze.png");
  silverImg = loadImage("images/silver.png");
  goldImg = loadImage("images/gold.png");
}


function setup(){
  canvas = createCanvas(displayWidth,displayHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

  obstacles = createGroup();

  for(var i = 0; i<5; i++){
    oilX = random(200,950);
    oilY = random(-height*4,height-300);

    oilSpill = createSprite(oilX,oilY);
    oilSpill.addImage("oil",oilSpillImage);
    obstacles.add(oilSpill);
  }
}


function draw(){
  if(playerCount === 4 && finishedPlayers === 0){
    game.update(1);
  }
  if(gameState === 1){
    clear();
    game.play();
  }
  
  if(gameState === 2 && finishedPlayers === 4){
    //game.end();
    game.displayRanks();
  }

  if(finishedPlayers === 4){
    game.update(2);
  }
}
