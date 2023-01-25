import { useEffect, useState, useRef } from "react";
import {
  VRButton,
  ARButton,
  Controllers,
  Hands,
  XRButton,
  XRProvider,
} from "@react-three/xr";
import { Canvas,useLoader  } from "@react-three/fiber";
import { XR, useXR } from "@react-three/xr";
import { getFile } from "../Utils/firebase";
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import axios from 'axios';

export default function ARDisplay({ selectedReverie }) {
  const [show, setShow] = useState(false);
  const [img, setImg] = useState();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    console.log("REVERIE IS ON AR DISPLAY", selectedReverie);
    setTimeout(function () {
      setShow(true);
    }, 3000);

    document.getElementById('ARButtonId').click();

    getFile(selectedReverie["content"]["attachment"]["img"]["path_"]).then(
        (iconBase) => {
          console.log("iconBase",iconBase);
          setImg(iconBase)
          });
  }, []);

  useEffect(() => {
    if (img) {
        axios.get(img, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            responseType: 'arraybuffer'
        }).then(response => {
            const texture = new TextureLoader().parse(response.data);
            setTexture(texture);
        }).catch(error => {
            console.log(error);
        });
    }
}, [img]);

  useEffect(() => {
    console.log("textureasdasdasd",texture);
  }, [texture]);


  return (
    <>
      <div className={`sidebarContainer ${show ? "show" : ""}`}>
        <div className="reverieList">
            <h1>{selectedReverie["content"].title}</h1>
            <p>{selectedReverie["content"].description}</p>
        <XRButton
            className="ARButtonStyle"
            id="ARButtonId"
            mode={"AR"}
            sessionInit={{ optionalFeatures: ['local-floor',"dom-overlay"],  domOverlay: {root: document.body} }}
            enterOnly={true}
            exitOnly={false}
            onError={(error) => console.log(error)}>
            <div className="ARTag">Reverie Visualization</div>
        </XRButton>

        {/* <ARButton id="ARButtonId" className="ARButtonStyle">Open Reverie</ARButton> */}
        </div>
      </div>

      <Canvas>
        <XR>
          {img && <mesh position={[0, 2, -2] }>
            <planeBufferGeometry  args={[2, 2]}/>
            <meshBasicMaterial  map={texture} />
          </mesh>}
        </XR>
      </Canvas>
    </>
  );
}

