import { useEffect } from "react";

import "./App.css";

import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  useEffect(() => {
    const data = async () => {
      await fetch("http://localhost:9797/api").then((data) => data.json());
    };
    data();
  }, []);

  return (
    <div>
      <Dashboard/>
    </div>
  );
}

export default App;
