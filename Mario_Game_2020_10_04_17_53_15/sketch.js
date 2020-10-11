var player, playerDeath, jumpsound, brick, brickImage, brickGroup, mob, mobAnimation, mobGroup, gameover, gameoverImage, ground, groundImage, playerAnimation, bg, PLAY = 1,
  END = 0,
  gamestate = PLAY,
  barrier, restart, restartImage, checkpointSound, score = 0,
  hiscore = 0;

function preload() {
  playerAnimation = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  mobAnimation = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");
  brickImage = loadImage("brick.png");
  groundImage = loadImage("ground2.png");
  bg = loadImage("bg.png");
  jumpsound = loadSound("jump.mp3");
  playerDeath = loadImage("collided.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  checkpointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(800, 400);
  ground = createSprite(400, 390, 800, 20);
  ground.addImage(groundImage);
  ground.scale = 1.3;
  player = createSprite(100, 305, 1, 1)
  player.addAnimation("mario", playerAnimation);
  player.scale = 1.9;
  barrier = createSprite(400, 350, 800, 20);
  barrier.visible = false;
  brickGroup = new Group();
  mobGroup = new Group();
  player.addAnimation("death", playerDeath)
  gameover = createSprite(400, 200, 1, 1);
  gameover.addImage(gameoverImage);
  gameover.visible = false;
  restart = createSprite(400, 250, 1, 1);
  restart.addImage(restartImage);
  restart.visible = false;
  restart.scale = 0.8;
}



function draw() {
  background(bg);
  console.log(player.y);
  player.velocityY = player.velocityY + 1;
  if (gamestate === PLAY) {
    if (keyDown("up") && player.y > 300) {
      player.velocityY = -17;
      jumpsound.play();
    }
    player.collide(barrier);
    ground.velocityX = -5;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if (brickGroup.isTouching(player)) {
      player.collide(brickGroup);
      player.velocityY = -17;
      jumpsound.play();
    }
    score = score + Math.round(getFrameRate() / 30);
    if (score % 100 === 0 && score > 1) {
      checkpointSound.play();
    }
    if (mobGroup.isTouching(player)) {
      player.changeAnimation("death", playerDeath);
      player.velocityY = -10;
      gamestate = END;
      if (score > hiscore) {
        score = hiscore;
      }
    }
    spawnMob();
    spawnBrick();
  }
  if (gamestate === END) {
    ground.velocityX = 0;
    mobGroup.destroyEach();
    brickGroup.destroyEach();
    gameover.visible = true;
    restart.visible = true;
    if (mousePressedOver(restart)) {
      gamestate = PLAY;
      player.y = 305;
      player.changeAnimation("mario", playerAnimation);
      ground.velocityX = -5;
      gameover.visible = false;
      restart.visible = false;
    }
  }
  fill("black");
  text("SCORE: " + score, 710, 30);
  text("HISCORE: " + hiscore, 700, 50);
  drawSprites();
}

function spawnMob() {
  if (frameCount % 80 === 0) {
    mob = createSprite(400, 320, 1, 1);
    mob.addAnimation("plant", mobAnimation);
    mob.velocityX = -5;
    mobGroup.add(mob);
  }
}

function spawnBrick() {
  if (frameCount % 100 === 0) {
    brick = createSprite(600, 250, 1, 1);
    brick.addImage(brickImage);
    brick.velocityX = -5;
    brickGroup.add(brick);
  }
}