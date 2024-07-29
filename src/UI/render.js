import PubSub from "pubsub-js";

class Render {
  board(msg, boardArray) {
    console.log(boardArray);
    let board = document.querySelector(".board");
    let menu = document.querySelector(".menu");
    menu.classList.add("hidden");
    for (let y = 9; y >= 0; y--) {
      for (let x = 0; x < 10; x++) {
        let div = document.createElement("div");
        div.setAttribute("data-x", x);
        div.setAttribute("data-y", y);
        div.innerText = boardArray[y][x];
        board.append(div);
      }
    }
  }
  loading() {
    let menu = document.querySelector(".menu");
    menu.innerText = "loading";
  }
  listOfWords(msg, words) {
    let lsOfWords = document.querySelector(".list-words");
    for (let word of words) {
      let li = document.createElement("li");
      li.innerText = word;
      li.setAttribute("data-word", word);
      lsOfWords.append(li);
    }
  }
  win() {
    let menu = document.querySelector(".menu");
    menu.classList.remove("hidden");
    menu.innerText = "WIN";
  }
}

function highlightFoundWord(msg, [initialCoord, finalCoord, direction]) {
  // TODO: the code is f-ing ugly
  console.log(initialCoord);
  console.log(direction);
  let s = +initialCoord.y;
  let i = +initialCoord.x;
  let f = +finalCoord.x;
  let iy, fy;
  if (direction === "vertical") {
    s = +initialCoord.x;
    i = +initialCoord.y;
    f = +finalCoord.y;
  }
  if (direction === "diagonal") {
    iy = +initialCoord.y;
    fy = +finalCoord.y;
  }
  let selectedWord = "";
  let isLoop = true;
  let limit = 0;
  while (isLoop && limit <= 100) {
    limit++;
    if (i === f) isLoop = false;
    let cell = document.querySelector(
      `.board div[data-x="${i}"][data-y="${s}"]`,
    );
    if (direction === "vertical") {
      cell = document.querySelector(`.board div[data-x="${s}"][data-y="${i}"]`);
    }
    if (direction === "diagonal") {
      cell = document.querySelector(
        `.board div[data-x="${i}"][data-y="${iy}"]`,
      );
      if (iy < fy) iy++;
      if (iy > fy) iy--;
    }
    // TODO: diagonal
    cell.classList.add("found");
    selectedWord += cell.innerText;
    if (i < f) i++;
    if (i > f) i--;
  }

  return selectedWord;
}

function highlightFoundWordList(msg, [, , , word]) {
  let wordList = document.querySelector(`li[data-word="${word}"]`);
  wordList.classList.add("found-list");
}

let render = new Render();

export function renderInit() {
  PubSub.subscribe("RenderGame", render.board);
  PubSub.subscribe("RenderList", render.listOfWords);
  PubSub.subscribe("Loading", render.loading);
  PubSub.subscribe("RenderWin", render.win);
  PubSub.subscribe("FoundWord", highlightFoundWord);
  PubSub.subscribe("FoundWord", highlightFoundWordList);
}
