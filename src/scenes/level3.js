var player;
var stars;
var burger; //objeto adicional
var coke; //objeto adicional
var bombs;
var cursors;
var score;
var gameOver;
var scoreText;

export class level3 extends Phaser.Scene {
  constructor() {
    
    super("level3");
  }

  preload() {
    this.load.tilemapTiledJSON("map3", "public/assets/tilemaps/spongeboblevel3.json");
    this.load.image("fondonivel3", "public/assets/images/sky2.png");
    this.load.image("platform3", "public/assets/images/platform_atlas2.png");
  }

  create() {
    const map = this.make.tilemap({ key: "map3" });
    const tilesetBelow = map.addTilesetImage("sky2", "fondonivel3");
    const tilesetPlatform = map.addTilesetImage(
      "platform_atlas2",
      "platform3"
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

     //victoria 

     if (score == 150) {
        this.scene.start("Win", { score: score });  
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
