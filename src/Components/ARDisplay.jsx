import React, { useEffect } from "react";
import "./outer-website.css";

const ARScene = () => {
  useEffect(() => {
    startAR();
  }, []);

  const startAR = () => {
    const IFRAME_ID = "my-iframe";
    const iframe = document.getElementById(IFRAME_ID);
    const INNER_FRAME_URL = "https://maylandlabs.8thwall.app/reverie/";
    window.XRIFrame.registerXRIFrame(IFRAME_ID);
    iframe.setAttribute("src", INNER_FRAME_URL); // This is where the AR iframe's source is set.
    console.log("IFRAMEEE CONTENT", iframe.contentWindow);
    const checkIframeLoaded = setInterval(function () {
      if (iframe.contentWindow.document.readyState === "complete") {
        clearInterval(checkIframeLoaded);
        console.log("Iframe content loaded");
      }
    });
    window.addEventListener("message", (event) => {
      // Do we trust the sender of this message?  (might be
      // different from what we originally opened, for example).
      console.log("EXPERIENCE STARTED", event.data);
      if(event.data == "Experience Started"){
        iframe.contentWindow.postMessage("EXPERIENCE DATA RECEIVED", "*");
      }})
  };

  const stopAR = () => {
    const INNER_FRAME_URL = "https://maylandlabs.8thwall.app/reverie/";
    const IFRAME_ID = "my-iframe";
    const iframe = document.getElementById(IFRAME_ID);
    window.XRIFrame.deregisterXRIFrame();
    iframe.setAttribute("src", INNER_FRAME_URL); // This is where the AR iframe's source is set.
  };

  return (
    <div id="inline-ar">
      <iframe
        id="my-iframe"
        allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"

      ></iframe>
    </div>
  );
};

export default ARScene;
