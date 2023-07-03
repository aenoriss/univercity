import React, { useState, useEffect, useRef } from "react";
import { getFile, DBRetrieveRev } from "../Utils/firebase";
import ReplyBox from "./ReplyBox";
import "aframe";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Entity, Scene } from "aframe-react";

const ARDisplay2 = ({portalOpen}) => {
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

  const handleData = async (data) => {
    console.log("data", data);

    const promises = Object.entries(data).map(async (post) => {
      const imageUrl = await getFile(post[1].content.attachment.img.path_);
      if (imageUrl) {
        const isVideo = imageUrl.endsWith(".mp4") || imageUrl.endsWith(".webm");
        if (!isVideo) {
          const textureLoader = new TextureLoader();
          return new Promise((resolve) => {
            textureLoader.load(imageUrl, function (texture) {
              texture.needsUpdate = true;
              const updatedPost = {
                ...post[1],
                texture: { src: texture.image },
              };
              console.log("post", updatedPost);
              resolve(updatedPost);
            });
          });
        }
      }
    });

    const updatedPosts = await Promise.all(promises);

    const updatedData = Object.fromEntries(
      updatedPosts.map((updatedPost, index) => [
        Object.keys(data)[index],
        updatedPost,
      ])
    );

    setPosts(updatedData);
  };

  // const generateRandomPosition = () => {
  //   const distance = Math.random() * 10 + 5; // Adjust the distance range as needed
  //   const angle = Math.random() * Math.PI * 2; // Random angle in radians
  //   const x = distance * Math.cos(angle);
  //   const y = distance * Math.sin(angle);
  //   const z = distance; // Negative value to position in front of you
  //   return { x, y, z };
  // };

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
            {portalOpen &&
              Object.entries(posts).map(([key, post], index) => {
                const row = Math.floor(index / 3); // Calculate the row number
                const column = index % 3; // Calculate the column number
                const x = column * 3 - 3; // Adjust the x position based on the column
                const y = row * -3 + 2; // Adjust the y position based on the row

                return (
                  <Entity
                    key={key}
                    primitive="a-plane"
                    position={`${x} ${y} -6`}
                    material={{ src: post?.texture?.src }}
                    scale="2 2 2"
                    look-at="[0 0 0]"
                  />
                );
              })}
            {/* {!portalOpen && (
              <Entity
                primitive="a-plane"
                position={`0 2 -5`}
                // material={{ src: post?.texture?.src }}
                scale="3 3 3"
                look-at="[0 0 0]"
              />
            )} */}
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
