// Declaracion de variables para esta escena
var player;
var stars;
var burger; //objeto adicional
var bombs;
var cursors;
var score;
var gameOver;
var scoreText;

// Clase Play, donde se crean todos los sprites, el escenario del juego y se inicializa y actualiza toda la logica del juego.
export class Play extends Phaser.Scene {
  constructor() {
    // Se asigna una key para despues poder llamar a la escena
    super("Play");
  }

  preload() {
    this.load.tilemapTiledJSON("map", "public/assets/tilemaps/spongeboblevel1.json");
    this.load.image("fondonivel", "public/assets/images/sky2.png");
    this.load.image("platform", "public/assets/images/platform_atlas2.png");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });   
    const tilesetBelow = map.addTilesetImage("sky2", "fondonivel"); // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    const tilesetPlatform = map.addTilesetImage(                         // Phaser's cache (i.e. the name you used in preload)
      "platform_atlas2",
      "platform"
    );

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createLayer("sky2", tilesetBelow, 0, 0); //o era al reves dsp m fijo
    const worldLayer = map.createLayer("plataform_atlas2", tilesetPlatform, 0, 0);
    const objectsLayer = map.getObjectLayer("Objetos");

    worldLayer.setCollisionByProperty({ collides: true });

    // tiles marked as colliding
    /*
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    worldLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
    */

    // Find in the Object Layer, the name "dude" and get position
    const spawnPoint = map.findObject("Objetos", (obj) => obj.name === "dude");
    // The player and its settings
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    //  Input Events
    if ((cursors = !undefined)) {
      cursors = this.input.keyboard.createCursorKeys();
    }

    // Create empty group of starts
    stars = this.physics.add.group();

    // find object layer
    // if type is "stars", add to stars group
    objectsLayer.objects.forEach((objData) => {
      //console.log(objData.name, objData.type, objData.x, objData.y);

      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "star": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          var star = stars.create(x, y, "star");
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          break;
        }
      }
    });


       burger = this.physics.add.group();  //objeto adicional
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


    // group of bombs
    bombs = this.physics.add.group();

    
    //  The score
    scoreText = this.add.text(30, 6, "score: 0", {
      fontSize: "32px",
      fill: "##FFFFFF", //black text
    });

    // Collide the player and the stars with the platforms
    // REPLACE Add collision with worldLayer
    this.physics.add.collider(player, worldLayer);
    this.physics.add.collider(stars, worldLayer);
    this.physics.add.collider(burger, worldLayer); //objeto adicional
    this.physics.add.collider(bombs, worldLayer);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, this.collectStar, null, this);
    this.physics.add.overlap(player, burger, this.collectStar, null, this); //objeto adicional
    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

    gameOver = false;
    score = 0;
  }

  update() {
   //pasar a level2

   if (burger.countActive(true) === 0 && stars.countActive(true) === 0 ) {
    this.scene.start("level2", { score: score });  
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

    // REPLACE player.body.touching.down
    if (cursors.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-330);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText("Score: " + score);
  }
    //if (stars.countActive(true) === 0) { //  A new batch of stars to collect
    
   //   stars.children.iterate(function (child) {
   // child.enableBody(true, child.x, child.y + 10, true, true);
      

 collectburger(player, burger) //objeto adicional
 {   
        burger.disableBody(true, true);
        score += 15;
        scoreText.setText("Score: " + score);

  }
  

  hitBomb(player, bomb)
   {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    gameOver = true;

    // Función timeout usada para llamar la instrucción que tiene adentro despues de X milisegundos
    setTimeout(() => {
      // Instrucción que sera llamada despues del segundo
      this.scene.start("Retry", { score: score }); // se pasa el puntaje como dato a la escena RETRY
     }, 1000); // Ese número es la cantidad de milisegundos
  }
}
