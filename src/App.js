import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {Fallback, RootErrorBoundary} from "./pages/RootErrorBoundary"
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch"
// import {projectLoader} from "./pages/ProjectLoader";

let router = createBrowserRouter([
  {
    path: "/",
    element: <h1 className="h1"> Que onda </h1>,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: "login",
    element: <Login />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: "*",
    element: <NoMatch />,
    errorElement: <RootErrorBoundary />,
  },
]);

function App() {
  return <RouterProvider router={router} fallbackElement={<Fallback />} />;
}

export default App;
