import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import Signup from './Components/Signup';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
// import Map from "./Components/Map.jsx"
import Map from "./Components/Map"

function App() {
  const [globalStage, setGlobalStage] = useState(0)
  const [userData, setUserData] = useState(null)
  useEffect(()=> {
    console.log("DATAAAAAAA",userData )
  },[userData])

  const userDataHandler = (e) => {
    console.log("EJEEEEM",e)
    setUserData(e)
    setGlobalStage(1)
  };

  const render = (status) => {
    return <h1>{status}</h1>;
  };

  
  return (
    <div className="App">
       {(globalStage == 0 && userData == null) && <Signup userDataHandler={userDataHandler}/>}
       {globalStage == 1 &&<Wrapper apiKey={"AIzaSyAo7v_SfcffemdotwZkN2cJ4iww4HIHuCQ"} render={render}>
          <Map/>
       </Wrapper>}
       {globalStage == 1 && <Map/>}    
    </div>
  );
}

export default App;
