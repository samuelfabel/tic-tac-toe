import './Button.css';

export default function Button({ index, value, isWinner, onClick }) {
  return (
    <div className="tic-button">
      <button
        type="button"
        className={isWinner ? 'winner' : undefined}
        onClick={() => onClick(index)}
      >
        {value}
      </button>
    </div>
  );
}
