import PubSub from "pubsub-js";

// WARN: we just change the html structure, might want to make sure everything is okay
class Render {
  board(msg, boardArray) {
    console.log(boardArray);
    let playArea = document.querySelector(".play-area");
    playArea.innerHTML = "";
    let menu = document.querySelector(".menu");
    playArea.classList.remove("win");
    menu.classList.add("hidden");
    for (let y = 9; y >= 0; y--) {
      for (let x = 0; x < 10; x++) {
        let div = document.createElement("div");
        div.setAttribute("data-x", x);
        div.setAttribute("data-y", y);
        div.innerText = boardArray[y][x];
        playArea.append(div);
      }
    }
  }
  loading() {
    let menu = document.querySelector(".menu");
    menu.innerHTML = "";
    let p = document.createElement("p");
    p.innerText = "loading";
    p.classList.add("loading");
    menu.append(p);
  }
  listOfWords(msg, words) {
    let lsOfWords = document.querySelector(".list-words");
    lsOfWords.innerHTML = "";
    for (let word of words) {
      let li = document.createElement("li");
      li.innerText = word;
      li.setAttribute("data-word", word);
      lsOfWords.append(li);
    }
  }
  win() {
    let menu = document.querySelector(".menu");
    let playArea = document.querySelector(".play-area");
    playArea.classList.add("win");
    menu.classList.remove("hidden");
    let h2 = document.createElement("h2");
    let btn = document.createElement("button");
    h2.innerText = "189s";
    h2.classList.add("final-time");
    btn.innerText = "Play Again";
    btn.classList.add("playAgainBtn");
    menu.innerHTML = "";

    menu.append(h2);
    menu.append(btn);
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
