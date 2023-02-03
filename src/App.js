import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, useRef } from "react";
import Signup from "./Components/Signup";
import Landing from "./Components/Landing";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
// import Map from "./Components/Map";
import {
  closeMap
} from "./Components/VanillaMap";
import Sidebar from "./Components/SideBar";
// import ARDisplay from "./Components/ARDisplay";
import ARDisplay from "./Components/ARDisplay";


// import Map from "./Components/Map"

function App() {
  const [globalStage, setGlobalStage] = useState(-1);
  const [userData, setUserData] = useState(null);
  const [selectedReverie, setSelectedReverie] = useState(null);

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
    if(selectedReverie){
      setGlobalStage(2);
      closeMap()
    }
  }, [selectedReverie]);


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
        <Sidebar className="sidebar" userData={userData} selectedReverie={setSelectedReverie} globalStage={setGlobalStage}/>
      )}

      {globalStage == 2 && <ARDisplay className="ARDisplay" selectedReverie={selectedReverie} globalStage={setGlobalStage} />}
    </div>
  );
}

export default App;
