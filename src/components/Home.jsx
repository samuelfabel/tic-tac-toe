import React from 'react';
import './Home.css';
import Button from './Button';
import TicTacManager from '../application/TicTacManager';

export default class Home extends React.Component {
    manager = new TicTacManager();
    current = 'X';
    winner = {};
    running = true;
    winnerSymbol = '';

    constructor(props) {
        super(props);

        for (let i = 1; i <= 9; i++) {
            this.winner[i] = false;
        }
        this.state = this.refreshState();
    }

    refreshState() {
        const state = {
            state: this.manager.getState(),
            current: this.current,
            winner: this.winner,
            winnerSymbol: this.winnerSymbol,
            running: this.running
        };

        if (this.state) {
            this.setState(state);
        }

        return state;
    }

    handleClick(index) {
        if (this.running && this.state.state[index] === '') {
            const winner = this.manager.set(index, this.current);

            if (winner) {
                this.current = '';

                for (let i = 0; i < winner.length; i++) {
                    const element = winner[i];
                    this.winner[element] = true;
                    this.winnerSymbol = this.state.state[element];
                }

                this.running = false;
            } else {
                this.current = this.current === 'X' ? 'O' : 'X';
            }

            this.refreshState();
        }
    }

    reset() {
        this.manager.reset();
        for (let i = 1; i <= 9; i++) {
            this.winner[i] = false;
        }
        this.winnerSymbol = '';
        this.current = 'X';
        this.running = true;

        this.refreshState();
    }

    render() {
        return (
            <div>
                <header>
                    <h1>Tic Tac Toe</h1>
                </header>
                <div className="container">
                    <div className="chart">
                        <div>
                            <Button onClick={this.handleClick.bind(this)} index="1" currentState={this.state.state}></Button>
                            <Button onClick={this.handleClick.bind(this)} index="2" currentState={this.state.state}></Button>
                            <Button onClick={this.handleClick.bind(this)} index="3" currentState={this.state.state}></Button>
                        </div>
                        <div>
                            <Button onClick={this.handleClick.bind(this)} index="4" currentState={this.state.state}></Button>
                            <Button onClick={this.handleClick.bind(this)} index="5" currentState={this.state.state}></Button>
                            <Button onClick={this.handleClick.bind(this)} index="6" currentState={this.state.state}></Button>
                        </div>
                        <div>
                            <Button onClick={this.handleClick.bind(this)} index="7" currentState={this.state.state}></Button>
                            <Button onClick={this.handleClick.bind(this)} index="8" currentState={this.state.state}></Button>
                            <Button onClick={this.handleClick.bind(this)} index="9" currentState={this.state.state}></Button>
                        </div>
                    </div>
                    <div className="status">
                        <div>
                            Current:<span>{this.state.current}</span>
                        </div>
                        <div>
                            Winner:<span>{this.state.winnerSymbol}</span>
                        </div>
                        <div>
                            <button onClick={this.reset.bind(this)}>Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}