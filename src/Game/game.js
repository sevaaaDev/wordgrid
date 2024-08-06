import { getWords } from "./wordGenerator";
import PubSub from "pubsub-js";

export class Game {
  constructor(words) {
    this.words = words;
    this.board = this.generateBoard();
    this.numOfFoundWord = 0;
    this.foundWords = [];
    this.bestRecord = 0;
    this.score = 0;
    this.id;
  }
  init() {
    this.getFromLocalStorage();
    PubSub.publish("Loading");
    getWords().then((res) => {
      this.words = res;
      this.initBoard();
      PubSub.publish("RenderGame", this.board);
      PubSub.publish("RenderList", this.words);
      this.stopwatch();
    });
  }

  initBoard() {
    let i = 0;
    for (let word of this.words) {
      let orientation = ["vertical", "diagonal", "horizontal"];
      this.placeWord(word, orientation[i++]);
      if (i > 3) i = 0;
    }
    this.fillBoard();
  }

  getFromLocalStorage() {
    let item = localStorage.getItem("record");
    if (item === null) return;
    if (item === "null") {
      localStorage.removeItem("record");
      return;
    }
    this.bestRecord = item;
  }

  setLocalStorage() {
    localStorage.setItem("record", this.bestRecord);
  }

  availableCoordinate = this.generateAvailableCoordinate();
  stopwatch() {
    PubSub.publish("UpdateSecond", this.score);
    this.id = setInterval(() => {
      this.score++;
      PubSub.publish("UpdateSecond", this.score);
    }, 1000);
  }
  generateBoard() {
    let array = [];
    for (let y = 0; y < 10; y++) {
      let insideArray = [];
      for (let x = 0; x < 10; x++) {
        insideArray[x] = null;
      }
      array[y] = insideArray;
    }
    return array;
  }

  generateAvailableCoordinate() {
    let array = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        let coord = [x, y];
        array.push(coord);
      }
    }
    return array;
  }

  #getRandom() {
    return Math.floor(Math.random() * 9);
  }
  getCoordinate(word, orientation) {
    // TODO: overlapping word (feat)
    let i = 0;
    main: while (true) {
      if (i > 500)
        throw new RangeError("Looping too much, please tell the dev");
      // TODO: make it so it wont be possible to exceed 100 loop
      // FIX: it exceed 100
      i++;
      let x = this.#getRandom();
      let y = this.#getRandom();
      //if (typeof this.board[y][x] === "string") {
      //  if (word.inludes(this.board[y][x])) {
      //    // find the letter
      //    // divide word into to array
      //    let mid = word.indexOf(this.board[y][x]);
      //    let wordArray = word.split("");
      //    let array1 = wordArray.splice(0, mid);
      //    let array2 = wordArray.splice(1, wordArray.length - 1);
      //  }
      //}
      if (this.board[y][x] !== null) continue main;

      placing: for (let i = 0; i < word.length; i++) {
        let inc = i + x;
        if (orientation === "diagonal") {
          let inc2 = y - i;
          if (inc2 < 0 || this.board[inc2][inc] !== null) {
            orientation = "vertical";
            continue main;
          }
          continue placing;
        }
        if (orientation === "vertical") {
          inc = y - i;
          if (inc < 0 || this.board[inc][x] !== null) {
            orientation = "horizontal";
            continue main;
          }
          continue placing;
        }
        if (this.board[y][inc] !== null) {
          orientation = "diagonal";
          continue main;
        }
      }
      return [x, y, orientation];
    }
  }

  placeWord(word, orientation) {
    let [x, y, newOrientation] = this.getCoordinate(word, orientation);
    orientation = newOrientation;
    // TODO: the word sometime is too close to eachother, maybe add restriction so they need too be a few cell away
    for (let letter of word) {
      if (orientation === "diagonal") {
        this.board[y--][x++] = letter;
        continue;
      }
      if (orientation === "vertical") {
        this.board[y--][x] = letter;
        continue;
      }
      this.board[y][x++] = letter;
    }
  }
  fillBoard() {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    for (let y of this.board) {
      for (let x in y) {
        let randomNum = Math.floor(Math.random() * 25);
        if (y[x] === null) y[x] = alphabet[randomNum];
      }
    }
  }
  checkWord(msg, { word, initial, final, orientation }) {
    word = word.toLowerCase();
    let index = this.words.indexOf(word);
    if (index === -1) return false;
    let foundWord = this.words.splice(index, 1);
    this.foundWords.push(foundWord);
    console.log("Found");
    this.checkWin();
    console.log(initial);
    PubSub.publish("FoundWord", [initial, final, orientation, word]);
    return true;
  }
  checkWin() {
    if (this.words.length === 0) {
      clearInterval(this.id);
      this.updateRecord();
      PubSub.publish("RenderWin", [this.bestRecord, this.score]);
      console.log(this.bestRecord);
      return true;
    }
    return false;
  }

  updateRecord() {
    if (this.bestRecord === 0 || this.score < this.bestRecord) {
      this.bestRecord = this.score;
    }
    this.setLocalStorage();
  }
  reset() {
    this.board = this.generateBoard();
    this.foundWords = [];
    this.score = 0;
  }
}
