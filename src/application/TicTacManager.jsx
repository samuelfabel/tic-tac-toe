export default class TicTacManager {
    states;
    xmarks;
    omarks;

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
        const mark = index % 3;
        if (value === 'X') {
            this.xmarks[mark].push(index);
        } else {
            this.omarks[mark].push(index);
        }

        this.states[index] = value;

        return this.checkWinner();
    }

    checkWinner() {
        const xhmarks = {};
        const ohmarks = {};

        for (let i = 0; i < 3; i++) {
            if (this.xmarks[i].length === 3) {
                return this.xmarks[i];
            }

            for (let j = 0; j < this.xmarks[i].length; j++) {
                const element = this.xmarks[i][j];

                xhmarks[(element - 1) / 3] = element;
            }

            if (this.omarks[i].length === 3) {
                return this.omarks[i];
            }

            for (let j = 0; j < this.omarks[i].length; j++) {
                const element = this.omarks[i][j];

                ohmarks[(element - 1) / 3] = element;
            }
        }

        for (let i = 0; i < 3; i++) {
            if (xhmarks[i] && xhmarks[i].length === 3) {
                return xhmarks[i];
            }

            if (ohmarks[i] && ohmarks[i].length === 3) {
                return ohmarks[i];
            }
        }

        let diagonal = this.checkDiagonal(this.xmarks);

        if (diagonal) {
            return diagonal;
        }

        diagonal = this.checkDiagonal(this.omarks);

        if (diagonal) {
            return diagonal;
        }

        return null;
    }

    checkDiagonal(marks) {
        console.log(marks);
        let mark1 = [];
        let mark2 = [];
        let value1 = 1;
        let value2 = 7;

        for (let i = 1; i < 4; i++) {
            const element = marks[i % 3];

            if (element.includes(value1)) {
                mark1.push(value1);
            }

            console.log(element, value2, element.includes(value2));

            if (element.includes(value2)) {
                mark2.push(value2);
            }

            value1 += 4;
            value2 -= 2;
        }

        console.log(mark1, mark2);

        if (mark1.length === 3) {
            return mark1;
        }

        if (mark2.length === 3) {
            return mark2;
        }

        return null;
    }
}
