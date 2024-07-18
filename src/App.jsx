import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function MyButton({ count, onClick }) {
  return <button onClick={onClick}>Clicked {count} times</button>;
}

function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div> */}
      <div>
        <h1>hello</h1>
        <MyButton count={count} onClick={handleClick} />
        <MyButton count={count} onClick={handleClick} />
      </div>
      {/* </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  );
}

export default App;
