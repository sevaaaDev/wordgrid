import PubSub from "pubsub-js";

class Render {
  board(msg, boardArray) {
    console.log(boardArray);
    let board = document.querySelector(".board");
    for (let y = 9; y >= 0; y--) {
      for (let x = 0; x < 10; x++) {
        let div = document.createElement("div");
        div.classList.add(`x-${x}`);
        div.classList.add(`y-${y}`);
        div.innerText = boardArray[y][x];
        board.append(div);
      }
    }
  }
}

let render = new Render();

export function renderInit() {
  PubSub.subscribe("RenderGame", render.board);
}
