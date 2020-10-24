import Phaser from "phaser";
import MainMenu from "./scenes/MainMenu";

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 780,
  scene: [
    MainMenu
  ]
};

const game = new Phaser.Game(config);
