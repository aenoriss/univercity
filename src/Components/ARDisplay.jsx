import { useEffect, useState, useRef } from "react";
import { XRButton } from "@react-three/xr";
import { Canvas, useLoader } from "@react-three/fiber";
import { XR, useXR } from "@react-three/xr";
import { getFile } from "../Utils/firebase";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import ReplyBox from "./ReplyBox";

export default function ARDisplay({ selectedReverie }) {
  const [show, setShow] = useState(false);
  const [img, setImg] = useState();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    console.log("REVERIE IS ON AR DISPLAY", selectedReverie);
    setTimeout(function () {
      setShow(true);
    }, 3000);

    document.getElementById("ARButtonId").click();

    getFile(selectedReverie["content"]["attachment"]["img"]["path_"]).then(
      (iconBase) => {
        console.log("iconBase", iconBase);
        setImg(iconBase);
      }
    );
  }, []);

  useEffect(() => {
    if (img) {
      const textureLoader = new TextureLoader();
      textureLoader.load(img, function (texture) {
        texture.needsUpdate = true;
        setTexture(texture);
      });
    }
  }, [img]);

  useEffect(() => {
    console.log("textureasdasdasd", texture);
  }, [texture]);

  return (
    <>
      <div className="reverie_info_panel">
        <h1>{selectedReverie["content"].title}</h1>
        <p>{selectedReverie["content"].description}</p>
      </div>

      <div className="reverie_reply_panel">
        <ReplyBox selectedReverie={selectedReverie} />
      </div>

      <div>
        <XRButton
          className="ARButtonStyle"
          id="ARButtonId"
          mode={"AR"}
          sessionInit={{
            optionalFeatures: ["local-floor", "dom-overlay"],
            domOverlay: { root: document.body },
          }}
          enterOnly={true}
          exitOnly={false}
          onError={(error) => console.log(error)}
        >
          <div className="ARTag"> </div>
        </XRButton>

        {/* <ARButton id="ARButtonId" className="ARButtonStyle">Open Reverie</ARButton> */}
      </div>

      <XRButton
        className="ARButtonStyle"
        id="ARButtonId"
        mode={"AR"}
        sessionInit={{
          optionalFeatures: ["local-floor", "dom-overlay"],
          domOverlay: { root: document.body },
        }}
        enterOnly={true}
        exitOnly={false}
        onError={(error) => console.log(error)}
      >
        <div className="ARTag"> </div>
      </XRButton>

      <Canvas>
        <XR>
          {texture && (
            <mesh position={[0, 2, -2]}>
              <ambientLight intensity={0.1} />
              <planeBufferGeometry
                args={[
                  texture["source"]["data"].naturalWidth / 1000,
                  texture["source"]["data"].naturalHeight / 1000,
                ]}
              />
              <meshBasicMaterial map={texture} transparent={false} />
            </mesh>
          )}
        </XR>
      </Canvas>
    </>
  );
}
