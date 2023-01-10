import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Signup from "./Components/Signup";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
// import Map from "./Components/Map";
import startMap from "./Components/VanillaMap";
import Sidebar from "./Components/SideBar";
// import Map from "./Components/Map"

function App() {
  const [globalStage, setGlobalStage] = useState(0);
  const [userData, setUserData] = useState(null);
  const [userPos, setuserPos] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // do something with the position data
        // console.log(position.coords);
        setuserPos(position.coords)
      },
      (error) => {
        // handle the error
      },
      { enableHighAccuracy: true }
    )})

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
    if(globalStage == 1){
      startMap();
    }
  }, [globalStage]);

  const userDataHandler = (e) => {
    console.log("EJEEEEM", e);
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


