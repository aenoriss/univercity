import { useEffect, useState, useRef } from "react";
import { XRButton } from "@react-three/xr";
import { Canvas, useLoader } from "@react-three/fiber";
import { XR, useXR } from "@react-three/xr";
import { getFile } from "../Utils/firebase";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import ReplyBox from "./ReplyBox";

export default function ARDisplay({ selectedReverie, globalStage }) {
  const [show, setShow] = useState(false);
  const [img, setImg] = useState();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    setTimeout(function () {
      setShow(true);
    }, 3000);

    getFile(selectedReverie["content"]["attachment"]["img"]["path_"]).then(
      (iconBase) => {
        setImg(iconBase);
      }
    );

    document.getElementById("ARButtonId").click();
  }, []);

  useEffect(() => {
  });

  useEffect(() => {
    if (img) {
      const textureLoader = new TextureLoader();
      textureLoader.load(img, function (texture) {
        texture.needsUpdate = true;
        setTexture(texture);
      });
    }
  }, [img]);

  const returnButtonHandler = (e) => {
    document.getElementById("ARButtonId").click();
    globalStage(1);
  };

  useEffect(() => {
  }, [texture]);

  return (
    <>
      <div className="reverie_info_panel">
        <div className="backButtonContainer">
          <div className="backButtonContainer" onClick={returnButtonHandler}>{"<"}</div>
        </div>
        <div className="reverie_info_panel_content">
          <div className="reverie_info_panel_content_text">
            <h1 className="reverie_info_panel_content_title">
              {selectedReverie["content"].title}
            </h1>
            <p className="reverie_info_description">
              {selectedReverie["content"].description}
            </p>
          </div>
        </div>
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
          enterOnly={false}
          exitOnly={false}
          onError={(error) => console.log(error)}
        >
          <div className="ARTag"></div>
        </XRButton>
      </div>

      <Canvas>
        <XR onSessionStart={(event) => console.log("AR INIT", event)}>
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