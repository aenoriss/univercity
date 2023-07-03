import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, useRef } from "react";
import Signup from "./Components/Signup";
import Landing from "./Components/Landing";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Sidebar from "./Components/SideBar";
import ARDisplay from "./Components/ARDisplay";
import {
  DBRetrievePortalState
} from "./Utils/firebase";

function App() {
  const [globalStage, setGlobalStage] = useState(-1);
  const [userData, setUserData] = useState(null);
  const [selectedReverie, setSelectedReverie] = useState(null);
  const [portalOpen, setportalOpen] = useState(false);

  useEffect(() => {
    DBRetrievePortalState(portalStateHandler)
    //Load Map
    //Retrieves userData from localStorage if exists.
    // let storedUserData = localStorage.getItem("userData");
    // if (storedUserData) {
    //   setUserData(JSON.parse(storedUserData));
    //   setGlobalStage(1);
    // }
  }, []);

  const portalStateHandler = (data) => {
    setportalOpen(data)
  };


  return (
    <div className="App">
        <div className="mapContainer">
          <ARDisplay portalOpen={portalOpen}/>
        </div>
        <Sidebar className="sidebar" portalOpen={portalOpen} />
    </div>
  );
}

export default App;