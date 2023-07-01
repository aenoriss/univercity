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
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(new Audio());

  useEffect(() => {
    getFile(selectedReverie["content"]["attachment"]["img"]["path_"])
      .then(url => setImageUrl(url))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    const audioAttachment = selectedReverie?.content?.attachment?.audio;
    if (audioAttachment && audioAttachment.path_) {
      getFile(audioAttachment.path_)
        .then(url => setAudioUrl(url))
        .catch(error => console.log(error));
    }
  }, [selectedReverie]);

  const handleAudioLoad = () => {
     if (audioUrl) {
       audioRef.current.src = audioUrl;
       audioRef.current.play();
       console.log("Audio link", audioUrl);
    }
 };

  useEffect(() => {
    if (imageUrl) {
      // Check if the image is actually a video
      const isVideo = imageUrl.endsWith('.mp4') || imageUrl.endsWith('.webm');
      if (!isVideo) {
        // Load the texture normally for images
        const textureLoader = new TextureLoader();
        textureLoader.load(imageUrl, function (texture) {
          texture.needsUpdate = true;
          setTexture(texture);
        });
      } 
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


  const returnButtonHandler = (e) => {
    //Trying to fix back button map rendering issue
     window.location.reload();
    
    // Stop audio playback
    audioRef.current.pause();
  
    // Stop camera
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
  }, [texture]);
  
  useEffect(() => {
  if (audioUrl) {
    audioRef.current.src = audioUrl;

    // Check if user agent is from iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      // On iOS devices, audio can only be played in response to a user interaction
      // So, we wait for the user to interact with the page and then play the audio
      const handleClick = () => {
        audioRef.current.play();
        document.removeEventListener('click', handleClick);
      };
      document.addEventListener('click', handleClick);
    } else {
      // On other devices, play the audio immediately
      audioRef.current.play();
    }
  }
}, [audioUrl]);

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
             material={{ src: texture?.source?.data}}
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