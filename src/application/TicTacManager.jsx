export default class TicTacManager {
  constructor() {
    this.states = {};
    this.xmarks = {};
    this.omarks = {};
    this.reset();
  }

  reset() {
    for (let i = 1; i <= 9; i++) {
      this.states[i] = '';
    }

    for (let i = 0; i < 3; i++) {
      this.xmarks[i] = [];
      this.omarks[i] = [];
    }
  }

  getState() {
    return this.states;
  }

  set(index, value) {
    const column = index % 3;

    if (value === 'X') {
      this.xmarks[column].push(index);
    } else {
      this.omarks[column].push(index);
    }

    this.states[index] = value;

    return this.checkWinner();
  }

  isTie() {
    return Object.values(this.states).every((cell) => cell !== '');
  }

  checkWinner() {
    for (let i = 0; i < 3; i++) {
      if (this.xmarks[i].length === 3) {
        return this.xmarks[i];
      }

      if (this.omarks[i].length === 3) {
        return this.omarks[i];
      }
    }

    const rowMarks = { x: [[], [], []], o: [[], [], []] };

    for (let i = 0; i < 3; i++) {
      for (const index of this.xmarks[i]) {
        rowMarks.x[Math.floor((index - 1) / 3)].push(index);
      }

      for (const index of this.omarks[i]) {
        rowMarks.o[Math.floor((index - 1) / 3)].push(index);
      }
    }

    for (let i = 0; i < 3; i++) {
      if (rowMarks.x[i].length === 3) {
        return rowMarks.x[i];
      }

      if (rowMarks.o[i].length === 3) {
        return rowMarks.o[i];
      }
    }

    const diagonalX = this.checkDiagonal(this.xmarks);
    if (diagonalX) {
      return diagonalX;
    }

    const diagonalO = this.checkDiagonal(this.omarks);
    if (diagonalO) {
      return diagonalO;
    }

    return null;
  }

  checkDiagonal(marks) {
    const diagonal1 = [];
    const diagonal2 = [];
    let value1 = 1;
    let value2 = 7;

    for (let i = 1; i < 4; i++) {
      const column = marks[i % 3];

      if (column.includes(value1)) {
        diagonal1.push(value1);
      }

      if (column.includes(value2)) {
        diagonal2.push(value2);
      }

      value1 += 4;
      value2 -= 2;
    }

    if (diagonal1.length === 3) {
      return diagonal1;
    }

    if (diagonal2.length === 3) {
      return diagonal2;
    }

    return null;
  }
}
