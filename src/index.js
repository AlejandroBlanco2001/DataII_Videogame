import Phaser from "phaser";
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
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity : {y: 100},
      debug: true
    }
  }
};

const game = new Phaser.Game(config);