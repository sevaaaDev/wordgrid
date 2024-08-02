import PubSub from "pubsub-js";

// WARN: we just change the html structure, might want to make sure everything is okay
class Render {
  fillBoard(msg, boardArray) {
    let playArea = document.querySelector(".play-area");
    let menu = document.querySelector(".menu");
    menu.classList.add("hidden");
    playArea.classList.remove("transparent");
    for (let y = 9; y >= 0; y--) {
      for (let x = 0; x < 10; x++) {
        let div = document.querySelector(
          `.play-area div[data-x="${x}"][data-y="${y}"]`,
        );
        div.innerText = boardArray[y][x];
      }
    }
  }
  board() {
    let playArea = document.querySelector(".play-area");
    playArea.innerHTML = "";
    for (let y = 9; y >= 0; y--) {
      for (let x = 0; x < 10; x++) {
        let div = document.createElement("div");
        div.setAttribute("data-x", x);
        div.setAttribute("data-y", y);
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
  win(msg, [bestRecord, score]) {
    let menu = document.querySelector(".menu");
    let playArea = document.querySelector(".play-area");
    playArea.classList.add("transparent");
    menu.classList.remove("hidden");
    let h2 = document.createElement("h2");
    let bestRecordTxt = document.createElement("p");
    let btn = document.createElement("button");
    bestRecordTxt.classList.add("bestRecord");
    bestRecordTxt.innerText = "Best Record: " + bestRecord + "s";
    h2.innerText = score + "s";
    h2.classList.add("final-time");
    btn.innerText = "Play Again";
    btn.classList.add("playAgainBtn");
    menu.innerHTML = "";

    menu.append(h2);
    menu.append(bestRecordTxt);
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
  let listOfColor = ["green", "blue", "orange"];
  let random = Math.floor(Math.random() * 3);
  while (isLoop && limit <= 100) {
    limit++;
    if (i === f) isLoop = false;
    let cell = document.querySelector(
      `.board div[data-x="${i}"][data-y="${s}"]`,
    );
    switch (direction) {
      case "vertical":
        cell = document.querySelector(`div[data-x="${s}"][data-y="${i}"]`);
        break;
      case "diagonal":
        cell = document.querySelector(
          `.board div[data-x="${i}"][data-y="${iy}"]`,
        );
        if (iy < fy) iy++;
        if (iy > fy) iy--;
        break;
    }
    cell.classList.add("found");
    cell.classList.add(listOfColor[random]);
    selectedWord += cell.innerText;
    if (i < f) i++;
    if (i > f) i--;
  }

  return selectedWord;
}

function updateSecond(msg, newSecond) {
  let secDiv = document.querySelector(".second-indicator");
  secDiv.innerText = newSecond + "s";
}

function highlightFoundWordList(msg, [, , , word]) {
  let wordList = document.querySelector(`li[data-word="${word}"]`);
  wordList.classList.add("found-list");
}

function removeAllHighlight() {
  let cells = document.querySelectorAll(".play-area div.found");
  if (cells === null) return;
  cells.forEach((cell) => (cell.className = ""));
}

let render = new Render();

export function renderInit() {
  PubSub.subscribe("RenderGame", render.fillBoard);
  PubSub.subscribe("RenderGame", removeAllHighlight);
  PubSub.subscribe("RenderBoard", render.board);
  PubSub.subscribe("RenderList", render.listOfWords);
  PubSub.subscribe("Loading", render.loading);
  PubSub.subscribe("RenderWin", render.win);
  PubSub.subscribe("FoundWord", highlightFoundWord);
  PubSub.subscribe("FoundWord", highlightFoundWordList);
  PubSub.subscribe("UpdateSecond", updateSecond);
}
