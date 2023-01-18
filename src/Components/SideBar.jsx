import { useEffect, useState } from "react";
import { FirebaseSignup, FirebaseSignin, FirebaseDB, DBAddReverie, FirebaseStorage } from "../Utils/firebase";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Cropper from "./Cropper";

export default function Sidebar({userData, userPos}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgContent, setImgContent] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(function() {
      setShow(true);
    }, 3000);
  }, []);

  const titleHandler = (e) => {
    setTitle(e.target.value);
  };

  const descriptionHandler = (e) => {
    setDescription(e.target.value);
  };

  const imageHandler = (e) => {
    setImgContent(e.target.files[0]);
  };

  const handleAr = (e) => {
    window.open('https://ar-test-snowy.vercel.app/', '_blank', 'noreferrer');
  };

  const submitHandler = (e) => {
    //Here is where Firebase is contacted
    FirebaseStorage(imgContent, userData).then((snapshot)=> {
      DBAddReverie({user: userData.uid, content: {title, description, attachment:{img: snapshot}}, userPos: {lat: userPos.latitude, long: userPos.longitude}, time: Date.now()}).then((res) => {
          });
    })
  };

  return (
    <div className={`sidebarContainer ${show ? "show" : ""}`}>
       <div className="button_container_four">
          <button id="createReverieButton" onClick={handleAr}>
            Enter Reverie
          </button>
        </div>
      <h1 className="reverie_form_title">Create Reverie</h1>
      <div className="reverie_form_container">
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
        {/* {userPos && <h2>{userPos.latitude + " " + userPos.longitude}</h2>} */}
        <div className="button_container_one">
          <button onClick={submitHandler} id="createReverieButton" >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}


