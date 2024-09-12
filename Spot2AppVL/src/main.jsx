import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Assuming you have the App component

function Main() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <App />
      <App />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);