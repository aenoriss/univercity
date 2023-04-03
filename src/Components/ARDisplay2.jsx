import React, { useState, useEffect, useRef } from 'react';
import { getFile } from "../Utils/firebase";
import ReplyBox from "./ReplyBox";
import 'aframe';
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Entity, Scene } from 'aframe-react';

const ARDisplay2 = ({ selectedReverie, globalStage }) => {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    getFile(selectedReverie["content"]["attachment"]["img"]["path_"])
      .then(url => setImageUrl(url))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    if (imageUrl) {
      const textureLoader = new TextureLoader();
      textureLoader.load(imageUrl, function (texture) {
        texture.needsUpdate = true;
        setTexture(texture);
      });
    }
  }, [imageUrl]);
  

  useEffect(() => {
    const constraints = { video: { facingMode: 'environment' }, audio: false };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
  }, [texture]);

  const returnButtonHandler = (e) => {
    globalStage(1);
  };

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

    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Scene>
            <Entity
             primitive="a-plane"
             position="0 2 -5"
             material={{ src: texture?.source?.data }}
             scale="2 2 2"
             />
        </Scene>
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>

  </>  
  );
};

export default ARDisplay2;
