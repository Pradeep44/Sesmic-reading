import { useEffect } from "react";

import "./App.css";

function App() {
  useEffect(() => {
    const data = async () => {
      await fetch("http://localhost:9797/api").then((data) => data.json());
    };
    data();
  }, []);

  return (
    <div>
      <h1>Hello world</h1>
    </div>
  );
}

export default App;
