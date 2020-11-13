import Phaser from "../node_modules/phaser";
import MainMenu from "./scenes/MainMenu";
import Lobby from "./scenes/Lobby";
import BallGame from "./scenes/BallGame";

const config = {
  type: Phaser.AUTO,
  width: 1090,
  height: 720,
  scene: [
    MainMenu,
    Lobby,
    BallGame
  ]
};

const game = new Phaser.Game(config);