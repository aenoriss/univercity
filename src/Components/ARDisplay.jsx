import React, { useState, useEffect, useRef } from "react";
import { getFile, DBRetrieveRev } from "../Utils/firebase";
import ReplyBox from "./ReplyBox";
import "aframe";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Entity, Scene } from "aframe-react";

const ARDisplay2 = () => {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [texture, setTexture] = useState(null);
  const [posts, setPosts] = useState([]);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    DBRetrieveRev(handleData).then((response) => {});
  }, []);

  useEffect(() => {
    console.log("posts_updated", posts);
  }, [posts]);

  const handleData = (data) => {
    Object.entries(data).forEach((post) => {
      getFile(post[1].content.attachment.img.path_).then((imageUrl) => {
        if (imageUrl) {
          // Check if the image is actually a video
          const isVideo =
            imageUrl.endsWith(".mp4") || imageUrl.endsWith(".webm");
          if (!isVideo) {
            // Load the texture normally for images
            const textureLoader = new TextureLoader();
            textureLoader.load(imageUrl, function (texture) {
              texture.needsUpdate = true;
              const updatedPost = { ...post[1], texture: { src: texture.image } };
              console.log("post",updatedPost )
              data[post[0]] = updatedPost;
              setPosts(data);
              // console.log("sdad")
            });
          }
        }
      });
    });
  };

  const generateRandomPointInSphere = (radius) => {
    // Generate random spherical coordinates
    const theta = Math.random() * 2 * Math.PI; // Azimuthal angle (longitude)
    const phi = Math.acos(2 * Math.random() - 1); // Polar angle (latitude)

    // Convert spherical coordinates to Cartesian coordinates
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    // Return the generated point as an object
    return { x, y, z };
  };

  // useEffect(() => {
  //   const audioAttachment = selectedReverie?.content?.attachment?.audio;
  //   if (audioAttachment && audioAttachment.path_) {
  //     getFile(audioAttachment.path_)
  //       .then(url => setAudioUrl(url))
  //       .catch(error => console.log(error));
  //   }
  // }, [selectedReverie]);

  //   const handleAudioLoad = () => {
  //      if (audioUrl) {
  //        audioRef.current.src = audioUrl;
  //        audioRef.current.play();
  //        console.log("Audio link", audioUrl);
  //     }
  //  };

  // useEffect(() => {
  //   if (imageUrl) {
  //     // Check if the image is actually a video
  //     const isVideo = imageUrl.endsWith(".mp4") || imageUrl.endsWith(".webm");
  //     if (!isVideo) {
  //       // Load the texture normally for images
  //       const textureLoader = new TextureLoader();
  //       textureLoader.load(imageUrl, function (texture) {
  //         texture.needsUpdate = true;
  //         setTexture(texture);
  //       });
  //     }
  //   }
  // }, [imageUrl]);

  useEffect(() => {
    const constraints = { video: { facingMode: "environment" }, audio: false };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  // useEffect(() => {
  // }, [texture]);

  //   useEffect(() => {
  //   if (audioUrl) {
  //     audioRef.current.src = audioUrl;

  //     // Check if user agent is from iOS device
  //     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  //     if (isIOS) {
  //       // On iOS devices, audio can only be played in response to a user interaction
  //       // So, we wait for the user to interact with the page and then play the audio
  //       const handleClick = () => {
  //         audioRef.current.play();
  //         document.removeEventListener('click', handleClick);
  //       };
  //       document.addEventListener('click', handleClick);
  //     } else {
  //       // On other devices, play the audio immediately
  //       audioRef.current.play();
  //     }
  //   }
  // }, [audioUrl]);

  return (
    <>
      {/* <div className="reverie_info_panel">
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
      </div> */}

      {/* <div className="reverie_reply_panel">
        <ReplyBox selectedReverie={selectedReverie} />
      </div> */}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Scene>
            {Object.entries(posts).map(([key, post]) => (
              <Entity
                key={key}
                primitive="a-plane"
                position={generateRandomPointInSphere(3)}
                material={{ src: post?.texture?.source?.data}}
                scale="1 1 1"
                look-at="[0 0 0]"
              />
            ))}
          </Scene>
        </div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </>
  );
};

export default ARDisplay2;
