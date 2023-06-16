import React from "react";
import { useRouteError } from "react-router-dom";

export function Fallback() {
  return <p>Performing initial data "load"</p>;
}

export function RootErrorBoundary() {
  let error = useRouteError();
  return (
    <div>
      <h1>Uh oh, something went terribly wrong 😩</h1>
      <pre>{error.message || JSON.stringify(error)}</pre>
      <button onClick={() => (window.location.href = "/")}>
        Click here to reload the app
      </button>
    </div>
  );
}
