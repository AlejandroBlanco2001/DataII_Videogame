import Phaser from "phaser";
import MainMenu from "./scenes";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1280,
  height: 780,
  scene: [
    MainMenu
  ]
};

const game = new Phaser.Game(config);

