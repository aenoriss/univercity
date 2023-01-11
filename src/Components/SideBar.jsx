import { useEffect, useState } from "react";
import { FirebaseSignup, FirebaseSignin, FirebaseDB, DBAddReverie, FirebaseStorage } from "../Utils/firebase";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Cropper from "./Cropper";

export default function Sidebar({userData, userPos}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgContent, setImgContent] = useState("");

  const titleHandler = (e) => {
    setTitle(e.target.value);
    console.log(userPos)
    console.log(title);
  };

  const descriptionHandler = (e) => {
    setDescription(e.target.value);
    console.log(description);
  };

  const imageHandler = (e) => {
    setImgContent(e.target.files[0]);
  };

  const submitHandler = (e) => {
    console.log("userPos", userPos)
    //Here is where Firebase is contacted
    FirebaseStorage(imgContent, userData).then((snapshot)=> {
      console.log("snapshot", snapshot)
      DBAddReverie({user: userData.uid, content: {title, description, attachment:{img: snapshot}}, userPos: {lat: userPos.latitude, long: userPos.longitude}, time: Date.now()}).then((res) => {
        console.log("reverie created")
          });
    })
  };

  return (
    <div className="sidebarContainer">
      <h1>Create Reverie</h1>
      <div className="">
        <input
          type="text"
          className="email"
          placeholder="Name"
          value={title}
          onChange={titleHandler}
        />
        <input
          type="text"
          className="email"
          placeholder="Content"
          value={description}
          onChange={descriptionHandler}
        />
        <input
          type="file"
          id="docpicker"
          accept="image/png, image/jpeg"
          onChange={imageHandler}
        />
        {userPos && <h2>{userPos.latitude + " " + userPos.longitude}</h2>}
        <div className="button_container_one">
          <button onClick={submitHandler} id="createReverieButton" >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}


