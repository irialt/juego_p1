import Button from "../js/button.js";

// se crean los botones, el logo y el fondo del menú principal
export class MainMenu extends Phaser.Scene {
    constructor() {
        // key
        super("MainMenu")
    }

    create() {
        // Fondo menú principal
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'mainmenufondo')
        .setScale(1.1);

        // Logo
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY/1.5, 'logo');

        // Boton para comenzar a jugar
        const boton = new Button
        (this.cameras.main.centerX,
         this.cameras.main.centerY + this.cameras.main.centerY/3, 'Play', this, () => {

            // pasar a la escena Play
            this.scene.start("Play");
        });
    }
}