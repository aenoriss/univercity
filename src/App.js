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
import ARDisplay2 from "./Components/ARDisplay2";

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

  return (
    <div className="App">
        <div className="mapContainer">
          <p>XR Viewer</p>
        </div>
        <Sidebar className="sidebar" userData={userData} selectedReverie={setSelectedReverie} globalStage={setGlobalStage}/>
    </div>
  );
}

export default App;