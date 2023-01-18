import { useState } from "react";

export default function Landing({stageHandler}) {
  const [img, setImage] = useState("");

  const enterHandler = () => {
    stageHandler(0);
  }

  return (
    <div className="landing">
      <div className="title_header">
        <img className="logo" width="150px" src="sideworld_logo.jpg" />
        <h1>Sideworld</h1>
        <p className="subTitle">
          Post your <b className="highlightedText">ideas</b> into the real world
          using <b className="highlightedText">augmented reality</b>
        </p>
      </div>
      <div className="button_container_three">
        <button id="login" onClick={enterHandler}>
          Join the dreamers
        </button>
      </div>
    </div>
  );
}
