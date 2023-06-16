import React from "react";

import { LoaderFunctionArgs } from "react-router-dom";
import { json } from "react-router-dom";

export function projectLoader({ params } = LoaderFunctionArgs) {
  if (params.projectId === "unauthorized") {
    throw json({ contactEmail: "administrator@fake.com" }, { status: 401 });
  }

  if (params.projectId === "broken") {
    // Uh oh - in this flow we somehow didn't get our data nested under `project`
    // and instead got it at the root - this will cause a render error!
    return json({
      id: params.projectId,
      name: "Break Some Stuff",
      owner: "The Joker",
      deadline: "June 2022",
      cost: "FREE",
    });
  }

  return json({
    project: {
      id: params.projectId,
      name: "Build Some Stuff",
      owner: "Joe",
      deadline: "June 2022",
      cost: "$5,000 USD",
    },
  });
}
