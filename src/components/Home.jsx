import { useCallback, useMemo, useRef, useState } from 'react';
import './Home.css';
import Button from './Button';
import TicTacManager from '../application/TicTacManager';

const createInitialWinner = () =>
  Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, false]));

export default function Home() {
  const manager = useRef(new TicTacManager());
  const [board, setBoard] = useState(() => manager.current.getState());
  const [current, setCurrent] = useState('X');
  const [winner, setWinner] = useState(createInitialWinner);
  const [winnerSymbol, setWinnerSymbol] = useState('');
  const [isTie, setIsTie] = useState(false);
  const [running, setRunning] = useState(true);

  const handleClick = useCallback(
    (index) => {
      if (!running || board[index] !== '') {
        return;
      }

      const winningCells = manager.current.set(index, current);

      if (winningCells) {
        const nextWinner = createInitialWinner();
        let symbol = '';

        for (const cell of winningCells) {
          nextWinner[cell] = true;
          symbol = manager.current.getState()[cell];
        }

        setWinner(nextWinner);
        setWinnerSymbol(symbol);
        setCurrent('');
        setRunning(false);
      } else if (manager.current.isTie()) {
        setIsTie(true);
        setCurrent('');
        setRunning(false);
      } else {
        setCurrent((player) => (player === 'X' ? 'O' : 'X'));
      }

      setBoard({ ...manager.current.getState() });
    },
    [board, current, running],
  );

  const reset = useCallback(() => {
    manager.current.reset();
    setBoard({ ...manager.current.getState() });
    setWinner(createInitialWinner());
    setWinnerSymbol('');
    setIsTie(false);
    setCurrent('X');
    setRunning(true);
  }, []);

  const cells = useMemo(() => Array.from({ length: 9 }, (_, i) => i + 1), []);

  return (
    <div>
      <header>
        <h1>Jogo da Velha</h1>
      </header>
      <div className="container">
        <div className="chart">
          {[0, 1, 2].map((row) => (
            <div key={row}>
              {cells.slice(row * 3, row * 3 + 3).map((index) => (
                <Button
                  key={index}
                  index={index}
                  value={board[index]}
                  isWinner={winner[index]}
                  onClick={handleClick}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="status">
          <div>
            Jogador atual: <span>{current}</span>
          </div>
          <div>
            {isTie ? (
              <>
                Resultado: <span>Empate</span>
              </>
            ) : (
              <>
                Vencedor: <span>{winnerSymbol}</span>
              </>
            )}
          </div>
          <div>
            <button type="button" onClick={reset}>
              Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
