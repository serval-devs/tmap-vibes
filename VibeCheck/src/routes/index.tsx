import { createFileRoute } from "@tanstack/react-router";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 bg-blue-100 flex flex-col items-center space-y-4">
      <h3>Vite + React + TS + Tailwind + Tanstack Router</h3>
      <div className="flex items-center justify-center space-x-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card p-4 space-y-4 bg-red-200 shadow-md rounded-md">
        <div className="flex items-center justify-center space-x-4">
          <Button
            className="border-4 bg-orange-50 outline-2 outline-red-400"
            onClick={() => setCount((count) => count + 1)}
          >
            count i {count}
          </Button>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}
