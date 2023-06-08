import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Fallback, RootErrorBoundary } from "./pages/RootErrorBoundary";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import UploadImages from "./pages/UploadImages"
import { createContext } from "react";
// import {projectLoader} from "./pages/ProjectLoader";

const initalAuthState = {
  loggedIn: false,
  auths: [],
  status: "idle",
  sites: [],
};

export const AuthContext = createContext(initalAuthState);

function App() {
  
  const [auth, setAuth] = useState(initalAuthState);
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
      path: "upload-images",
      element: <UploadImages />,
      errorElement: <RootErrorBoundary />,
    },
    {
      path: "*",
      element: <NoMatch />,
      errorElement: <RootErrorBoundary />,
    },
  ]);

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      <RouterProvider router={router} fallbackElement={<Fallback />} />
    </AuthContext.Provider>
  );
}

export default App;
