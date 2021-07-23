class Game {
  constructor(){}
  
  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })
   
  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }
    car1 = createSprite(100,200);
    car1.debug = "true";
    car1.addImage("car1",carImg1);
    car2 = createSprite(300,200);
    car2.debug = "true";
    car2.addImage("car2",carImg2);
    car3 = createSprite(500,200);
    car3.debug = "true";
    car3.addImage("car3",carImg3);
    car4 = createSprite(700,200);
    car4.debug = "true";
    car4.addImage("car4",carImg4);

    // storing in an array
    cars = [car1,car2,car3,car4];

    // initially false
    passedFinish = false;
  }

  play(){
    form.hide();
    textSize(30);
  //text("Game Start",120,100);
    Player.getPlayerInfo();
    player.getFinishedPlayers();

    if(allPlayers !== undefined){
      background(groundImg);

      image(trackImg, 0, -displayHeight*4, displayWidth, displayHeight*5);

      // index of an array
      var index = 0;
      // x and y position of the cars
      var x = 175;
      var y;

      //var display_position = 130;
      for(var plr in allPlayers){
        console.log(plr);
        // add 1 to the index for every loop
        index = index+1;
        console.log("I am index: " +index);

        // position the car a little away from each other in x direction 
        x = 200+ (index*200) + allPlayers[plr].xPos;

        // use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        
       // console.log(cars[index-1].x);
        // assigning x and y values to the car
        cars[index-1].x = x;
        cars[index-1].y = y;

        textAlign(CENTER);
        textSize(20);
        text(allPlayers[plr].name, cars[index - 1].x, cars[index - 1].y + 75);

        console.log(cars[index-1].x);

        console.log(cars[index-1].y);

        console.log(index);
        console.log("Player Index: " +player.index);
        
        if(index === player.index){

          fill("red");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;

          if(cars[index-1].isTouching(obstacles)){
            skidSound.play();
            yVel -=0.9;
          }
        }
        
      }
      
    }
    console.log(player.index);
/*
    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance = player.distance + 10;
      player.update();
    }
*/
    if(player.distance < 3700){
      if(keyIsDown(38) && player.index !== null){
        yVel += 0.9;
        if(keyIsDown(37)){
            xVel -= 0.2;
        }
        if(keyIsDown(39)){
            xVel += 0.2;
        }
      }
      else if(keyIsDown(38) && yVel>0 && player.index !== null){
        yVel -= 0.1;
        xVel *= 0.9;
      }
      else{
        xVel *= 0.985;
        yVel *= 0.985;
      }
    }
    else if(passedFinish === false){
      yVel *= 0.7;
      xVel *= 0.7;
      Player.updateFinishedPlayers();
      player.place = finishedPlayers;

      player.update();
      passedFinish = true;
    }
    else{
      yVel *= 0.8;
      xVel *= 0.8; 
    }

    /*if(player.distance > 3860){
      gameState = 2;
    }*/

    //move the car
    player.distance += yVel;
    yVel *= 0.98;

    player.xPos += xVel;
    xVel *= 0.985;

    player.update();

    drawSprites();
  }

  displayRanks(){
    //display the medals
    camera.position.y = 0;
    camera.position.x = 0;

    imageMode(CENTER);

    Player.getPlayerInfo();

    image(bronzeImg, displayWidth/-4 , -100 + displayHeight/9,200,240);
    image(silverImg, displayWidth/4 , -100 + displayHeight/10,225,270);
    image(goldImg, 0,-100,250,300);

    textAlign(CENTER);
    textSize(50);
    for(var plr in allPlayers){
      if(allPlayers[plr].place === 1){
        text("1st: " + allPlayers[plr].name, 0, 85);
      }
      else if(allPlayers[plr].place === 2){
        text("2nd: " + allPlayers[plr].name, displayWidth/4, displayHeight/9 + 73);
      }
      else if(allPlayers[plr].place === 3){
        text("3rd: " + allPlayers[plr].name, displayWidth/-4, displayHeight/10 + 76);
      }
      else{
        textSize(30);
        text("Honorable Mention: " + allPlayers[plr].name, 0, 225);
      }
    }
  }
}
  
//end(){
    //console.log("Game Ended");
    //alert("game ended");
  //}
