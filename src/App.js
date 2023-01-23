import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, useRef } from "react";
import Signup from "./Components/Signup";
import Landing from "./Components/Landing";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { DBRetrieveRev } from "./Utils/firebase";
// import Map from "./Components/Map";
import {
  getMapLocation,
  initMap,
  setMarkers,
  initWebGLOverlayView,
} from "./Components/VanillaMap";
import Sidebar from "./Components/SideBar";
import { Marker } from "@react-google-maps/api";
// import Map from "./Components/Map"

function App() {
  const [globalStage, setGlobalStage] = useState(-1);
  const [userData, setUserData] = useState(null);
  const [userPos, setuserPos] = useState(null);
  const [reverieList, setReverieList] = useState();
  const [loadedMap, setLoadedMap] = useState(false);
  const [map, setMap] = useState(null);
  const [distanceArray, setDistanceArray] = useState(null);

  useEffect(() => {
    //Load Map
    //Retrieves userData from localStorage if exists.
    let storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setGlobalStage(1);
    }
  }, []);

  useEffect(() => {
    if (loadedMap == true && reverieList != undefined) {
      setMarkers(reverieList, map);
    }
  }, [reverieList]);

  useEffect(() => {
    if (globalStage == 1) {
      DBRetrieveRev(setReverieList);
      if (loadedMap == false) {
        initMap().then((map) => {
          console.log("apiLoader", map);

          setMap(map);
          if (navigator.geolocation) {
            //Start tracking user's location

            navigator.geolocation.watchPosition(
              (position) => {
                // do something with the position data
                setuserPos({
                  lat: position.coords["latitude"],
                  long: position.coords["longitude"],
                });
                getMapLocation(position.coords, map);
                initWebGLOverlayView(map);
              },
              (error) => {
                // handle the error
              },
              { enableHighAccuracy: true }
            );
          }
        });
        setLoadedMap(true);
      }
    }
  }, [globalStage]);

  const userDataHandler = (e) => {
    localStorage.setItem("userData", JSON.stringify(e));
    setUserData(e);
    setGlobalStage(1);
  };



  return (
    <div className="App">
      {globalStage == -1 && userData == null && (
        <Landing stageHandler={setGlobalStage} />
      )}
      {globalStage == 0 && userData == null && (
        <Signup userDataHandler={userDataHandler} />
      )}
      {globalStage == 1 && (
        <div className="mapContainer">
          <div id="map"></div>
        </div>
      )}
      {globalStage == 1 && (
        <Sidebar className="sidebar" userData={userData} userPos={userPos} reverieList={reverieList} />
      )}
    </div>
  );
}

export default App;
