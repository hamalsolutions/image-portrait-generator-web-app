import React from "react";
import { Link } from "react-router-dom";

export default function NoMatch() {
  return (
    <div>
      <h1 data-cy='notFoundTitle'>Whoops! Seems like nothing was found</h1>
      <h2>Nothing to see here after all!</h2>
      <p>
        <Link to="/login">Go to the login page</Link>
      </p>
    </div>
  );
}