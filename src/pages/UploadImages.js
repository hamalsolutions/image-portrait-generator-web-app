import React, { useContext } from "react";
import { AuthContext } from "../App";

export default function UploadImages() {
  const authContext = useContext(AuthContext);
  return (
    <div>
      <h2>We're still building this page bro</h2>
      
      {JSON.stringify(authContext)}
    </div>
  );
}