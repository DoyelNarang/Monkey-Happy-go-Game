//Declaring sprites, their images or animations and groups for bananas and obstacles.
var monkey, monkeyAnimation;
var ground, invisibleGround, groundImage;
var backgroundScene, backgroundImage;
var bananaGroup, bananaImage;
var obstaclesGroup, rock, rock1, rock2;

//Declaring game states and intializing the game state.
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Declaring the score and bananas eaten.
var score, eats;

function preload(){

    //Loading monkey animation.
    monkeyAnimation = loadAnimation("monkey1.png", "monkey2.png", "monkey3.png", "monkey4.png", "monkey5.png", "monkey6.png", "monkey7.png", "monkey8.png", "monkey9.png");
  
    //Loading image for background.
    backgroundImage = loadImage("forest.jpg");
  
    //Loading image for ground.
    groundImage = loadImage("ground.png");
  
    //loading image for banana.
    bananaImage = loadImage("banana.png");
  
    //Loading images for obstacles.
    rock = loadImage("rock.png");
    rock1 = loadImage("rock1.png");
    rock2 = loadImage("rock2.png");

}

function setup(){
  
    //Creating background, adding its image and moving it.
    backgroundScene = createSprite(200, 250, 400, 200);
    backgroundScene.addImage(backgroundImage);
    backgroundScene.velocityX = -5;
  
    //Creating monkey, adding its animation and making it small.
    monkey = createSprite(30, 365, 20, 20);
    monkey.addAnimation("monkey", monkeyAnimation);   
    monkey.scale = 0.1;
  
    //Creating ground, adding its image and making it big.
    ground = createSprite(200, 460, 400, 20);
    ground.addImage(groundImage);
    ground.scale = 9;
    ground.velocityX = -5;
  
    //Creating invisible ground.
    invisibleGround = createSprite(200, 365, 400, 10);
    invisibleGround.visible = false;
  
    //Creating banana and obstacle groups.
    bananaGroup = new Group();
    obstaclesGroup = new Group();
  
    //Initializing score and bananas eaten to 0.
    score = 0;
    eats = 0;

}

function draw(){

    //Hiding multiple sprites.
    background("white");
  
    //Making monkey look like it's walking on the ground.
    monkey.collide(invisibleGround);
  
    if(gameState === PLAY){
      //Increasing the score.
      score = score + Math.round(getFrameRate()/60);
      
      //Increasing background and ground speed based on the score.
      backgroundScene.velocityX = -(5 + score/100)
      ground.velocityX = -(5 + score/100)
      
      //Resetting background and ground.
      if(backgroundScene.x < 0){
        backgroundScene.x = backgroundScene.width/2;
      }

      if(ground.x < 0){
        ground.x = ground.width/2;
      }

      //Making the monkey jump.
      if(keyDown("space") && monkey.y >= 325){
        monkey.velocityY = -17;
      }
      
      //Adding gravity
      monkey.velocityY = monkey.velocityY + 0.8;
      
      //Destroying the banana and increase the number of bananas eaten if monkey touches it.
      if(monkey.isTouching(bananaGroup)){
        bananaGroup.destroyEach();
        eats = eats + 1;
      }
      
      //Ending the game if monkey touches the obstacles.
      if(monkey.isTouching(obstaclesGroup)){
        gameState = END;
      }

      //Spawning bananas.
      spawnBananas();

      //Spawning obstacles.
      spawnObstacles();
    } else if(gameState === END){
      //Stopping the background and ground from moving.
      backgroundScene.velocityX = 0;
      ground.velocityX = 0;
      
      //Stopping  the elements of banana and obstacles groups from coming.
      bananaGroup.setVelocityXEach(0);
      obstaclesGroup.setVelocityXEach(0);
      
      //Making the elements of the groups stay.
      bananaGroup.setLifetimeEach(-1);
      obstaclesGroup.setLifetimeEach(-1);
      
      //Resetting the game if R is pressed.
      if(keyDown("r")){
        reset();
      }  
    }
  
    //Drawing the sprites.
    drawSprites();
  
    //Showing score and bananas eaten.
    textSize(20);
    fill("white");
    text("Score : " + score, 20, 30);
    text("Bananas Eaten : " + eats, 200, 30)
  
    //Showing game over text if game is over.
    if(gameState === END){
      textSize(20);
      fill("white");
      text("Game Over", 150, 70);
      text("Press R to Restart", 120, 100);
    }

}

function reset(){

    //Changing game state to play.
    gameState = PLAY;
  
    //Resetting the score and bananas eaten.
    score = 0;
    eats = 0;
  
    //Destroying the remaining bananas or obstacles.
    bananaGroup.destroyEach();
    obstaclesGroup.destroyEach();

}

function spawnBananas(){

    //Creating bananas every 80th frame.
    if(frameCount % 80 === 0){
      //Creating banana, adding its image, making it small and moving it.
      var banana = createSprite(400, 200, 20, 20);
      banana.addImage(bananaImage);
      banana.scale = 0.15;
      banana.velocityX = -(5 + score/100);
      
      //Spawning banana at random y positions and giving it a lifetime.
      banana.y = Math.round(random(120, 200));
      banana.lifetime = 80;
      
      //Adding banana to banana group.
      bananaGroup.add(banana);
    }
  
}

function spawnObstacles(){

    //Creating obstacles every 200th frame.
    if(frameCount % 200 === 0){
      //Creating obstacle and moving it.
      var obstacle = createSprite(400, 325, 20, 20);
      obstacle.velocityX = -(5 + score/100);
      
      //Giving choice for obstacle type.
      var rand = Math.round(random(1, 3));
      
      //Spawning random obstacles.
      switch(rand){
        case 1 :
          obstacle.addImage(rock);
          obstacle.scale = 0.7
          break;
        
        case 2 :
          obstacle.addImage(rock1);
          obstacle.scale = 0.5;
          break;
          
        case 3 :
          obstacle.addImage(rock2);
          obstacle.scale = 0.5;
          break;
        
        default :
          break;
      }
      //Givivng it a lifetime.
      obstacle.lifetime = 80;
      
      //Preventing the obstacles to hide monkey.
      monkey.depth = obstacle.depth + 1;
      
      //Adding obstacles to the obstacles group.
      obstaclesGroup.add(obstacle);
    }

}