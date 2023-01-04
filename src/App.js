import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import Signup from './Components/Signup';
import Map from "./Components/Map"

function App() {
  const [globalStage, setGlobalStage] = useState(0)
  const [userData, setUserData] = useState(null)
  Map()
  useEffect(()=> {
    console.log("DATAAAAAAA",userData )
  },[userData])

  const userDataHandler = (e) => {
    console.log("EJEEEEM",e)
    setUserData(e)
    setGlobalStage(1)

  };
  
  return (
    <div className="App">
       {(globalStage == 0 && userData == null) && <Signup userDataHandler={userDataHandler}/>}
       {globalStage == 1 &&<Map></Map>}
    </div>
  );
}

export default App;
