import "./style.css";
import { renderInit } from "./UI/render";
import { Game } from "./Game/game";
import { initBtn, initPlayAgainBtn, initSwipeSelect } from "./Input/input";
import PubSub from "pubsub-js";

let game = new Game();
renderInit();
initBtn();
initPlayAgainBtn();
initSwipeSelect();
PubSub.subscribe("SendAnswer", game.checkWord.bind(game));
PubSub.subscribe("StartGame", game.init.bind(game));
PubSub.subscribe("ResetGame", game.reset.bind(game));
window.addEventListener("load", () => {
  PubSub.publish("RenderBoard");
});
