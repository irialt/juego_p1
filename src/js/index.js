import { Preloads } from "../scenes/preloads.js";
import { MainMenu } from "../scenes/mainmenu.js";
import { Play } from "../scenes/play.js";
import { level2 } from "../scenes/level2.js";
import { level3 } from "../scenes/level3.js";
import { Retry } from "../scenes/retry.js";
import { Victory } from "../scenes/victory.js";


var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [Preloads, MainMenu, Play, level2, level3, Victory, Retry], // escenas del juego 
  
};

var game = new Phaser.Game(config);
