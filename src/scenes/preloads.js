// Clase Preloads, para separar los preloads y tener mejor orden
export class Preloads extends Phaser.Scene {
  //  escena
  constructor() {
    // key
    super("Preloads");
  }

  preload() {
    this.load.image("logo", "public/assets/images/programacion1gamelogo.png"); //logo juego
    this.load.image("gameover", "public/assets/images/p1gameover.png"); // imagen game over
    this.load.image("gameoverfondo", "public/assets/images/gameoverfondo.png"); // fondo game over
    this.load.image("victory", "public/assets/images/p1gamewinr.png"); // imagen victory
    this.load.image("victoryfondo", "public/assets/images/victoryfondo.png"); // fondo victory
    this.load.image("mainmenufondo", "public/assets/images/mainmenuscene.png"); // fondo del mainmenu
    this.load.image("sky", "public/assets/images/sky2.png"); //fondo de los niveles
    this.load.image("platform", "public/assets/images/platform_atlas2.png"); // atlas de la plataforma 1
    this.load.image("star", "public/assets/images/star.png"); //estrella
    this.load.image("burger", "public/assets/images/burger.png"); //objeto adicional 1
    this.load.image("coke", "public/assets/images/coke.png"); // objeto adicional 2 
    this.load.image("bomb", "public/assets/images/bomb.png"); //bomba
    this.load.spritesheet("dude", "public/assets/images/dude2.png", { //spongebob

      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // escena del menú principal
    this.scene.start("MainMenu");
  }
}
