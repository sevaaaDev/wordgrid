class Game {
  constructor(words) {
    this.words = words;
    this.board = this.generateBoard();
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
        if (direction === "vertical") {
          inc = y - i;
          if (inc < 0 || this.board[inc][x] !== null) {
            direction = "horizontal";
            continue main;
          }
          continue placing;
        }
        if (this.board[y][inc] !== null) {
          direction = "vertical";
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
      if (direction === "vertical") {
        this.board[y--][x] = letter;
        continue;
      }
      this.board[y][x++] = letter;
    }
  }
  checkWord(word) {
    for (let w of this.words) {
      if (w === word) {
        this.numOfFoundWord++;
        this.checkWin();
        return true;
      }
    }
    return false;
  }
  checkWin() {
    if (this.numOfFoundWord === 10) return true;
    return false;
  }
}
