import { getWords } from "./wordGenerator";
import PubSub from "pubsub-js";

export class Game {
  constructor(words) {
    this.words = words;
    this.board = this.generateBoard();
    this.numOfFoundWord = 0;
    this.foundWords = [];
  }
  init() {
    getWords().then((res) => {
      this.words = res;
      PubSub.publish("Loading");
      this.initBoard();
      PubSub.publish("RenderGame", this.board);
    });
  }

  initBoard() {
    let i = 0;
    for (let word of this.words) {
      let directions = ["vertical", "diagonal", "horizontal"];
      this.placeWord(word, directions[i++]);
      if (i > 3) i = 0;
    }
  }

  availableCoordinate = this.generateAvailableCoordinate();
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
  getCoordinate(word, direction) {
    let i = 0;
    main: while (true) {
      if (i > 100)
        throw new RangeError("Looping too much, please tell the dev");
      // TODO: make it so it wont be possible to exceed 100 loop
      i++;
      let x = this.#getRandom();
      let y = this.#getRandom();
      if (this.board[y][x] !== null) continue main;

      placing: for (let i = 0; i < word.length; i++) {
        let inc = i + x;
        if (direction === "diagonal") {
          let inc2 = y - i;
          if (inc2 < 0 || this.board[inc2][inc] !== null) {
            direction = "vertical";
            continue main;
          }
          continue placing;
        }
        if (direction === "vertical") {
          inc = y - i;
          if (inc < 0 || this.board[inc][x] !== null) {
            direction = "horizontal";
            continue main;
          }
          continue placing;
        }
        if (this.board[y][inc] !== null) {
          direction = "diagonal";
          continue main;
        }
      }
      return [x, y, direction];
    }
  }

  placeWord(word, direction) {
    let [x, y, newDirection] = this.getCoordinate(word, direction);
    direction = newDirection;
    for (let letter of word) {
      if (direction === "diagonal") {
        this.board[y--][x++] = letter;
        continue;
      }
      if (direction === "vertical") {
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
  checkWord(msg, word) {
    let index = this.words.indexOf(word);
    if (index === -1) return false;
    let foundWord = this.words.splice(index, 1);
    this.foundWords.push(foundWord);
    console.log("Found");
    this.checkWin();
    return true;
  }
  checkWin() {
    if (this.foundWords.length === 10) return true;
    return false;
  }
}
