import PubSub from "pubsub-js";
export function initSwipeSelect() {
  let playArea = document.querySelector(".play-area");
  playArea.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.target.releasePointerCapture(e.pointerId);
    let initialCell = e.target;
    let finalCell = e.target;
    initialCell.classList.add("selected");
    let selectedWord = "";
    function selectWord(e) {
      e.preventDefault();
      // TODO: awfuly ugly code
      finalCell = e.target;
      let orientation = "";
      // vertical
      if (finalCell.dataset.x === initialCell.dataset.x) {
        removeHighlight();
        orientation = "vertical";
      }
      // horizontal
      if (finalCell.dataset.y === initialCell.dataset.y) {
        removeHighlight();
        orientation = "horizontal";
      }
      // Diagonal
      if (
        Math.abs(finalCell.dataset.y - initialCell.dataset.y) ===
        Math.abs(finalCell.dataset.x - initialCell.dataset.x)
      ) {
        removeHighlight();
        orientation = "diagonal";
      }
      selectedWord = highlightSelected(
        initialCell.dataset,
        finalCell.dataset,
        orientation,
      );
      PubSub.publish("SendAnswer", {
        word: selectedWord,
        initial: initialCell.dataset,
        final: finalCell.dataset,
        orientation,
      });
    }
    function removeHighlight() {
      let cells = document.querySelectorAll(".selected");
      cells.forEach((cell) => {
        cell.classList.remove("selected");
      });
    }
    function submitWord() {
      playArea.removeEventListener("pointerover", selectWord);
      removeHighlight();
      // TODO: whats this use for?
    }
    playArea.addEventListener("pointerover", selectWord);
    document.addEventListener("pointerup", submitWord, { once: true });
  });
}

function highlightSelected(initialCoord, finalCoord, orientation) {
  // TODO: the code is f-ing ugly
  if (orientation === "") return "";
  let s = +initialCoord.y;
  let i = +initialCoord.x;
  let f = +finalCoord.x;
  let iy, fy;
  if (orientation === "vertical") {
    s = +initialCoord.x;
    i = +initialCoord.y;
    f = +finalCoord.y;
  }
  if (orientation === "diagonal") {
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
    if (orientation === "vertical") {
      cell = document.querySelector(`.board div[data-x="${s}"][data-y="${i}"]`);
    }
    if (orientation === "diagonal") {
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

function listenPlayAgainBtn() {
  let btn = document.querySelector(".playAgainBtn");
  btn.addEventListener("click", () => {
    PubSub.publish("ResetGame");
    PubSub.publish("StartGame");
  });
}
export function initPlayAgainBtn() {
  PubSub.subscribe("RenderWin", listenPlayAgainBtn);
}
