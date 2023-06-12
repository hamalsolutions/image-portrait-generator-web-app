import React, { useContext } from "react";
import { AuthContext } from "../App";

export default function UploadImages() {
  const authContext = useContext(AuthContext);
  return (
    <div>
      <h2 data-cy="uploadImagesContent">
        This page is currently under construction, please stay tunned for it's
        release
      </h2>
    </div>
  );
}
