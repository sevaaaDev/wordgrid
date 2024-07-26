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
      // TODO: add function that remove the prev highlight
      finalCell = e.target;
      let direction = "";
      if (finalCell.dataset.x === initialCell.dataset.x) {
        removeHighlight();
        direction = "vertical";
        selectedWord = highlightSelected(
          initialCell.dataset,
          finalCell.dataset,
          direction,
        );
      }
      if (finalCell.dataset.y === initialCell.dataset.y) {
        removeHighlight();
        direction = "horizontal";
        selectedWord = highlightSelected(
          initialCell.dataset,
          finalCell.dataset,
          "horizontal",
        );
      }
      if (
        Math.abs(finalCell.dataset.y - initialCell.dataset.y) ===
        Math.abs(finalCell.dataset.x - initialCell.dataset.x)
      ) {
        removeHighlight();
        direction = "diagonal";
        selectedWord = highlightSelected(
          initialCell.dataset,
          finalCell.dataset,
          "diagonal",
        );
      }
      PubSub.publish("SendAnswer", {
        word: selectedWord,
        initial: initialCell.dataset,
        final: finalCell.dataset,
        direction,
      });
    }
    function removeHighlight() {
      let cells = document.querySelectorAll(".selected");
      cells.forEach((cell) => {
        cell.classList.remove("selected");
      });
    }
    function submitWord() {
      board.removeEventListener("pointerover", selectWord);
      removeHighlight();
      // TODO: whats this use for?
      console.log(selectedWord);
      console.log(initialCell);
      console.log(finalCell);
    }
    board.addEventListener("pointerover", selectWord);
    document.addEventListener("pointerup", submitWord, { once: true });
  });
}
// TODO: add function that highlight the found word (persist)

function highlightSelected(initialCoord, finalCoord, direction) {
  // TODO: the code is f-ing ugly
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
