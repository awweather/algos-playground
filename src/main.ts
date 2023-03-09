import Phaser from "phaser";
import { Main } from "./mainScene";
import "./style.css";

const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [Main],
};

new Phaser.Game(config);
