import './Button.css';

const Button = (props) => {
    const handleClick = () => {
        props.onClick(parseInt(props.index));
    };

    return (
        <div className="tic-button">
            <button onClick={handleClick}>{props.currentState[parseInt(props.index)]}</button>
        </div>
    );
};


export default Button;