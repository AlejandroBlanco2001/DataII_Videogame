import Phaser from "phaser";
import MainMenu from "./scenes/MainMenu";
import Lobby from "./scenes/Lobby";

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 780,
  scene: [
    MainMenu,
    Lobby
  ]
};

const game = new Phaser.Game(config);