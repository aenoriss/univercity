import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Signup from "./Components/Signup";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { DBRetrieveRev } from "./Utils/firebase";
// import Map from "./Components/Map";
import startMap from "./Components/VanillaMap";
import Sidebar from "./Components/SideBar";
// import Map from "./Components/Map"

function App() {
  const [globalStage, setGlobalStage] = useState(0);
  const [userData, setUserData] = useState(null);
  const [userPos, setuserPos] = useState(null);
  const [reverieList, setReverieList] = useState(null);

  useEffect(() => {
    //Load Map
    //Retrieves userData from localStorage if exists.
    let storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setGlobalStage(1);
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // do something with the position data
        setuserPos(position.coords)
      },
      (error) => {
        // handle the error
      },
      { enableHighAccuracy: true }
    )

   DBRetrieveRev(setReverieList);

  }, []);

  useEffect(() => {
    if(globalStage == 1){
      startMap(reverieList);
    }
  }, [reverieList]);

  const userDataHandler = (e) => {
    localStorage.setItem("userData", JSON.stringify(e));
    setUserData(e);
    setGlobalStage(1);
  };

  return (
    
    <div className="App">
      {globalStage == 0 && userData == null && (
        <Signup userDataHandler={userDataHandler} />
      )}
      {globalStage == 1 && (
        <div className="mapContainer">
          <div id="map"></div>
        </div>
      )}
      {globalStage == 1 && (
        <Sidebar className="sidebar" userData={userData} userPos={userPos} />
      )}
    </div>
  );
}

export default App;


