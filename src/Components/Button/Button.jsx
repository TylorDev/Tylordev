import "./Button.scss";

export function Button({ handleClick, text, ...props }) {
  return (
    <button id="Button" onClick={handleClick}>
      {text}
    </button>
  );
}
