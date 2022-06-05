var player;
var stars;
var burger; //objeto adicional
var coke; //objeto adicional
var bombs;
var cursors;
var score;
var gameOver;
var scoreText;

export class level2 extends Phaser.Scene {
  constructor() {
    
    super("level2");  //.
  }

  preload() {
    this.load.tilemapTiledJSON("map2", "public/assets/tilemaps/spongeboblevel2.json");
    this.load.image("fondonivel2", "public/assets/images/sky2.png");
    this.load.image("platform2", "public/assets/images/platform_atlas2.png");
  }

  create() {
    const map = this.make.tilemap({ key: "map2" });

    
    const tilesetBelow = map.addTilesetImage("sky2", "fondonivel2");
    const tilesetPlatform = map.addTilesetImage(
      "platform_atlas2",
      "platform2"
    );

    const belowLayer = map.createLayer("sky2", tilesetBelow, 0, 0);
    const worldLayer = map.createLayer("platform_atlas2", tilesetPlatform, 0, 0);
    const objectsLayer = map.getObjectLayer("Objetos");

    worldLayer.setCollisionByProperty({ collides: true });

    const spawnPoint = map.findObject("Objetos", (obj) => obj.name === "dude");
    
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    
    if ((cursors = !undefined)) {
      cursors = this.input.keyboard.createCursorKeys();
    }

    
    stars = this.physics.add.group();
    objectsLayer.objects.forEach((objData) => {
      
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "stars": {
         
          var star = stars.create(x, y, "star");
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          break;
        }
      }
    });

    burger = this.physics.add.group();
    objectsLayer.objects.forEach((objData) => {
      
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "burger": {
         
          var star = burger.create(x, y, "burger");
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          break;
        }
      }
    });

    coke = this.physics.add.group();
    objectsLayer.objects.forEach((objData) => {
      
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "coke": {
         
          var star = coke.create(x, y, "coke");
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          break;
        }
      }
    });

 
    bombs = this.physics.add.group();

    
    scoreText = this.add.text(30, 6, "score: 0", {
      fontSize: "32px",
      fill: "#FFFFFF",
    });


    this.physics.add.collider(player, worldLayer);

    this.physics.add.collider(stars, worldLayer);
    this.physics.add.collider(burger, worldLayer);
    this.physics.add.collider(coke, worldLayer);


    this.physics.add.collider(bombs, worldLayer);

    
    this.physics.add.overlap(player, stars, this.collectStar, null, this);
    this.physics.add.overlap(player, burger, this.collectStar, null, this);
    this.physics.add.overlap(player, coke, this.collectStar, null, this);

    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

    gameOver = false;
    score = 0;
  }

  update() {

     //pasar al siguiente nivel:

    if (burger.countActive(true) === 0 && stars.countActive(true) === 0 && coke.countActive(true) === 0 ) {
      this.scene.start("level3", { score: score });  
    }

    if (gameOver) {
      return;
    }

    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    
    if (cursors.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-330);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0) {
     
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, child.y + 10, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  collectburger(player, burger) {
    burger.disableBody(true, true);
    score += 15;
    scoreText.setText("Score: " + score);
  }

  collectcoke(player, coke) {
    coke.disableBody(true, true);
    score += 15;
    scoreText.setText("Score: " + score);
  }



  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    gameOver = true;

    
    setTimeout(() => {
      
      this.scene.start(
        "Retry",
        { score: score } 
      );
    }, 1000); 
  }
}
