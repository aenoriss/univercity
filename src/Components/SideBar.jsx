import { useEffect, useState } from "react";
import {
  FirebaseSignup,
  FirebaseSignin,
  FirebaseDB,
  getFile,
  DBAddReverie,
  FirebaseStorage,
} from "../Utils/firebase";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Cropper from "./Cropper";
import { DBRetrieveRev } from "../Utils/firebase";
import {
  getMapLocation,
  initMap,
  setMarkers,
  initWebGLOverlayView,
  closeMap,
} from "./VanillaMap";

export default function Sidebar({ userData, selectedReverie }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgContent, setImgContent] = useState("");
  const [show, setShow] = useState(false);
  const [panelStage, setPanelStage] = useState("list");
  const [reverieDistance, setReverieDistance] = useState();
  const [userPos, setuserPos] = useState(null);
  const [reverieList, setReverieList] = useState();
  const [loadedMap, setLoadedMap] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    setTimeout(function () {
      setShow(true);
    }, 3000);
  }, []);

  useEffect(() => {
    if (loadedMap == true && reverieList != undefined) {
      setMarkers(reverieList, map);
    }
  }, [reverieList]);

  useEffect(() => {
  });

  useEffect(() => {
    console.log("init init 2")
    DBRetrieveRev(setReverieList);
    if (loadedMap == false) {
      initMap().then((map) => {
        setMap(map);
        initWebGLOverlayView(map).then((data)=> {
          console.log("MAP STARTED", data)
          navigator.geolocation.getCurrentPosition((position) => {
            getMapLocation(position.coords, map);
          });
          if (navigator.geolocation) {
            //Start tracking user's location
            console.log("pos requested from sidebar comp")
            navigator.geolocation.watchPosition(
              (position) => {
                // do something with the position data
                setuserPos({
                  lat: position.coords["latitude"],
                  long: position.coords["longitude"],
                });
                getMapLocation(position.coords, map);
              },
              (error) => {
                // handle the error
              },
              { enableHighAccuracy: false }
            );
          }
        })

     
      });
      setLoadedMap(true);
    }
  }, []);

  useEffect(() => {
    //Calculate distance from user to each reverie
    if ((userPos != null) & (reverieList != null)) {
      let reverieArr = [];
      for (const key in reverieList) {
        if (distance(userPos, reverieList[key].location) < 50) {
          let distanceValue = distance(userPos, reverieList[key].location);

          reverieList[key].distance = Math.round(distanceValue * 100) / 100;
          reverieArr.push(reverieList[key]);
        }
      }

      reverieDistance && reverieDistance.map((reverie) => {
        getFile(reverie["content"]["attachment"]["img"]["path_"]).then(
          (img) => {
            reverie["content"]["attachment"]["img"].file = img;
          })
        })

      setReverieDistance(reverieArr);
    }
  }, [userPos, reverieList]);

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

  const ARHandler = (reverie) => {
    selectedReverie(reverie);
  };

  const tabHandler = (tab) => {
    let tabId = tab.target.id;
    setPanelStage(tabId)
  };

  // const handleAr = (e) => {
  //   window.open("https://ar-test-snowy.vercel.app/", "_blank", "noreferrer");
  // };

  const submitHandler = (e) => {
    //Here is where Firebase is contacted
    FirebaseStorage(imgContent, userData).then((snapshot) => {
      DBAddReverie({
        user: userData.uid,
        content: { title, description, attachment: { img: snapshot } },
        location: { lat: userPos.lat, long: userPos.long },
        replies: [],
        time: Date.now(),
      }).then((res) => {});
    });
  };


  return (
    <div className={`sidebarContainer ${show ? "show" : ""}`}>
      <div className="tabContainer">
        <div id= "list" onClick={tabHandler} className={`tab tabLeft ${panelStage == "list" ? "activeTab" : ""}`}>Nearby</div>
        <div id= "create" onClick={tabHandler} className={`tab tabRight ${panelStage == "create" ? "activeTab" : ""}`}>Create</div>
      </div>
      <div className="sidebarPanel">
        {panelStage == "list" && (
          <div className="reverieList_main">
            <div className="reverie_form_header">
              <h1 className="reverie_form_title">Reveries</h1>
              <p>Dreaming around 🌠</p>
            </div>
            <div className="reverieList_list">
            {reverieDistance &&
              reverieDistance.map((reverie) => {
                return (
                  <div className="reverie_list_item"  onClick={() => ARHandler(reverie)}>
                    <div className="reverie_text_section bg-image" style={{ backgroundImage: `url(${reverie["content"]["attachment"]["img"].file})`}}>
                      <div className="reverie_header">
                        <div className="reverie_title">
                          {reverie["content"].title}
                        </div>
                        <div className="distanceTag">{reverie.distance}m</div>
                      </div>
                    </div>

                    <div className="reverie_button_section">
                      <div className="reverie_button_container">
                        <button
                          className="reverie_button"
                        >
                          Enter
                        </button>
                      </div>
                    </div>
                  </div>
                )})}
        </div>
        </div>)}

        {panelStage == "create" && (
          <div className="create_reverie">
            <h1 className="reverie_form_title">Create Reverie</h1>
            <div className="reverie_form_container">
              <input
                type="text"
                className="email"
                placeholder="Title"
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
        </div>
      )}
