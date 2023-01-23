import { useEffect, useState } from "react";
import {
  FirebaseSignup,
  FirebaseSignin,
  FirebaseDB,
  DBAddReverie,
  FirebaseStorage,
} from "../Utils/firebase";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Cropper from "./Cropper";

export default function Sidebar({ userData, userPos, reverieList }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgContent, setImgContent] = useState("");
  const [show, setShow] = useState(false);
  const [panelStage, setPanelStage] = useState("list");
  const [reverieDistance, setReverieDistance] = useState();

  useEffect(() => {
    setTimeout(function () {
      setShow(true);
    }, 3000);
  }, []);

  useEffect(() => {
    console.log("reverieList", reverieList);
    //Calculate distance from user to each reverie
    if ((userPos != null) & (reverieList != null)) {
      let reverieArr = [];
      for (const key in reverieList) {
        console.log(distance(userPos, reverieList[key].userPos));
        if (distance(userPos, reverieList[key].userPos) < 50) {

          let distanceValue = distance(userPos, reverieList[key].userPos);

          reverieList[key].distance = Math.round(distanceValue * 100) / 100;
          reverieArr.push(reverieList[key]);
        }
      }
      setReverieDistance(reverieArr);
    }
  }, [userPos, reverieList]);

  useEffect(() => {
    console.log("reverieDistance", reverieDistance);
  }, [reverieDistance]);

  const distance = (from, to) => {
    // Computational optimization for no change.

    if (from.lat === to.lat && from.long === to.long) {
      return 0;
    }

    const lat1R = (from.lat * Math.PI) / 180;
    const lat2R = (to.lat * Math.PI) / 180;
    const halfLatD = 0.5 * (lat2R - lat1R);
    const halfLngD =
      0.5 * ((to.long * Math.PI) / 180 - (from.long * Math.PI) / 180);
    const v =
      Math.sin(halfLatD) ** 2 +
      Math.sin(halfLngD) ** 2 * Math.cos(lat1R) * Math.cos(lat2R);
    const arc = 2 * Math.atan2(Math.sqrt(v), Math.sqrt(1 - v));

    return arc * 6371008.8; // Earth arithmetic mean radius, per en.wikipedia.org/wiki/Earth_radius
  };

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
    window.open("https://ar-test-snowy.vercel.app/", "_blank", "noreferrer");
  };

  const submitHandler = (e) => {
    //Here is where Firebase is contacted
    FirebaseStorage(imgContent, userData).then((snapshot) => {
      DBAddReverie({
        user: userData.uid,
        content: { title, description, attachment: { img: snapshot } },
        userPos: { lat: userPos.lat, long: userPos.long },
        time: Date.now(),
      }).then((res) => {});
    });
  };

  return (
    <div className={`sidebarContainer ${show ? "show" : ""}`}>
      {panelStage == "list" && (
        <div className="reverieList">
          <h1 className="reverie_form_title">Reveries</h1>
          <p>Active Reveries near you! 🌠</p>
          {reverieDistance &&
            Object.values(reverieDistance).map((reverie) => {
              return (
                <div className="reverie_list_item">
                  <div className="reverie_text_section">
                    <div className="reverie_header">
                      <div className="reverie_title">
                        {reverie["content"].title}
                      </div>
                      <div className="distanceTag">
                        {reverie.distance}m
                      </div>
                    </div>
                    <div className="reverie_description">
                      {reverie["content"].description}
                    </div>
                  </div>

                  <div className="reverie_button_section">
                    <div className="reverie_button_container">
                      <button className="reverie_button">Enter</button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
      {panelStage == "create" && (
        <div className="create_reverie">
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
              <button onClick={submitHandler} id="createReverieButton">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
