import PubSub from "pubsub-js";
export function initInput() {
  let btn = document.querySelector(".btn");
  let inputBox = document.querySelector(".answer");
  btn.addEventListener("click", () => {
    PubSub.publish("SendAnswer", inputBox.value);
  });
}

export function initSwipeSelect() {
  let board = document.querySelector(".board");
  board.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    let initialCell = e.target;
    let finalCell = e.target;
    initialCell.classList.add("selected");
    let selectedWord = "";
    function selectWord(e) {
      finalCell = e.target;
      if (finalCell.dataset.x === initialCell.dataset.x) {
        selectedWord = highlightSelected(
          initialCell.dataset,
          finalCell.dataset,
          "vertical",
        );
      }
      if (finalCell.dataset.y === initialCell.dataset.y) {
        selectedWord = highlightSelected(
          initialCell.dataset,
          finalCell.dataset,
          "horizontal",
        );
      }
      PubSub.publish("SendAnswer", selectedWord);
    }
    function submitWord() {
      board.removeEventListener("pointerover", selectWord);
      console.log(selectedWord);
      console.log(initialCell);
      console.log(finalCell);
    }
    board.addEventListener("pointerover", selectWord);
    document.addEventListener("pointerup", submitWord, { once: true });
  });
}

function highlightSelected(initialCoord, finalCoord, direction) {
  let s = +initialCoord.y;
  let i = +initialCoord.x;
  let f = +finalCoord.x;
  if (direction === "vertical") {
    s = +initialCoord.x;
    i = +initialCoord.y;
    f = +finalCoord.y;
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
    cell.classList.add("selected");
    selectedWord += cell.innerText;
    if (i < f) i++;
    if (i > f) i--;
  }

  return selectedWord;
}

export function initBtn() {
  let btn = document.querySelector(".startBtn");
  btn.addEventListener("click", () => {
    PubSub.publish("StartGame");
  });
}
