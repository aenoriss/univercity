import { useEffect, useState } from "react";
import {
  FirebaseSignup,
  FirebaseSignin,
  FirebaseDB,
  getFile,
  DBRetrieveRev,
  DBAddReverie,
  FirebaseStorage,
} from "../Utils/firebase";

export default function Sidebar({ portalOpen }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgContent, setImgContent] = useState("");
  const [reverieList, setReverieList] = useState("");
  const [show, setShow] = useState(false);
  const [panelStage, setPanelStage] = useState("create");

  useEffect(() => {
    setTimeout(function () {
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

  // const ARHandler = (reverie) => {
  //   selectedReverie(reverie);
  // };

  const tabHandler = (tab) => {
    let tabId = tab.target.id;
    setPanelStage(tabId);
  };

  const submitHandler = (e) => {
    FirebaseStorage(imgContent).then((imgSnapshot) => {
        DBAddReverie({
          content: {
            title,
            description,
            attachment: { img: imgSnapshot},
          },
          time: Date.now(),
        }).then((res) => 
          console.log(res)
        );
        
      });
    setPanelStage("list");
  };

  return (
    <div className={`sidebarContainer ${show ? "show" : ""}`}>
      <div className="tabContainer">
        {/* <div
          id="create"
          onClick={tabHandler}
          className={`tab tabRight ${
            panelStage == "create" ? "activeTab" : ""
          }`}
        >
          Create
        </div> */}
        {/* <div
          id="list"
          onClick={tabHandler}
          className={`tab tabLeft ${panelStage == "list" ? "activeTab" : ""}`}
        >
          Messages
        </div> */}
      </div>
      <div className="sidebarPanel">
        {!portalOpen && <div>
          <h2>Press the button to open the portal and see what's up!</h2>
        </div>}
        {portalOpen && (
          <div className="create_reverie">
            <h1 className="reverie_form_title">Share your day</h1>
            <div className="reverie_form_container">

              <input
                type="text"
                className="email"
                placeholder="Title"
                value={title}
                onChange={titleHandler}
                autoCorrect="off"
              />

              <input
                type="text"
                className="email"
                placeholder="Content"
                value={description}
                onChange={descriptionHandler}
                autoCorrect="off"
              />

              <div>
                <input
                  type="file"
                  id="docpicker"
                  accept="image/png, image/jpeg, video/mp4, video/webm"
                  onChange={imageHandler}
                />
              </div>

              {/* {userPos && <h2>{userPos.latitude + " " + userPos.longitude}</h2>} */}
              <div className="button_container_one">
                <button onClick={submitHandler} id="createReverieButton">
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
        {/* {panelStage == "list" && (
          <div className="reverieList_main">
            <div className="reverie_form_header">
              <h1 className="reverie_form_title">Reveries</h1>
              <p>Dreaming around 🌠</p>
            </div>
            <div className="reverieList_list">
              {reverieList &&
                reverieList.map((reverie) => {
                  return (
                    <div
                      className="reverie_list_item"
                      onClick={() => ARHandler(reverie)}
                    >
                      <div
                        className="reverie_text_section bg-image"
                        style={{
                          backgroundImage: `url(${reverie["content"]["attachment"]["img"].file})`,
                        }}
                      >
                        <div className="reverie_header">
                          <div className="reverie_title">
                            {reverie["content"].title}
                          </div>
                          <div className="distanceTag">{reverie.distance}m</div>
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
          </div>
        )} */}
      </div>
    </div>
  );
}
