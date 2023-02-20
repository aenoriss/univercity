import React, { useEffect } from "react";
import "./outer-website.css";

const ARScene = () => {
  const INNER_FRAME_URL = "https://8w.8thwall.app/inner-ar";
  const IFRAME_ID = "my-iframe";
  const CONTROLS_ID = "iframeControls";
  const START_BTN_ID = "startBtn";
  const STOP_BTN_ID = "stopBtn";
  const EXPAND_BTN_ID = "expandBtn";
  const LOGO_ID = "poweredByLogo";
  const DATE_ID = "date";

  const FULLSCREEN_IFRAME_CLASS = "fullscreen-iframe";
  const FULLSCREEN_CONTROLS_CLASS = "fullscreen-iframeControls";
  const FULLSCREEN_EXPAND_BTN_CLASS = "fullscreen-btn";
  const FULLSCREEN_STOP_BTN_CLASS = "hidden";

  const createObserver = () => {
    let cameraActive;

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (cameraActive && !entry.isIntersecting) {
          stopAR();
          cameraActive = false;
        }
      });
    };

    window.addEventListener("message", (event) => {
      if (event.data === "acceptedCamera") {
        cameraActive = true;
      }
    });

    const options = { threshold: 0.2 };
    new IntersectionObserver(handleIntersect, options).observe(
      document.getElementById(IFRAME_ID)
    );
  };

  const dateCheck = () => {
    const date = new Date();
    document.getElementById(DATE_ID).innerHTML = `${date.toLocaleDateString(
      "en-US",
      { month: "long" }
    )} ${date.toLocaleDateString("en-US", {
      day: "numeric",
    })}, ${date.toLocaleDateString("en-US", { year: "numeric" })}`;
  };

  const stopAR = () => {
    const controls = document.getElementById(CONTROLS_ID);
    controls.style.opacity = 1;
    controls.classList.remove("fade-in");
    controls.classList.add("fade-out");

    const startBtn = document.getElementById(START_BTN_ID);
    startBtn.style.opacity = 0;
    startBtn.style.display = "block";
    startBtn.classList.remove("fade-out");
    startBtn.classList.add("fade-in");

    const poweredByLogo = document.getElementById(LOGO_ID);
    poweredByLogo.style.opacity = 0;
    poweredByLogo.style.display = "block";
    poweredByLogo.classList.remove("fade-out");
    poweredByLogo.classList.add("fade-in");

    document.getElementById(IFRAME_ID).setAttribute("src", "");

    const styleCleanup = setTimeout(() => {
      startBtn.style.opacity = 1;
      startBtn.classList.remove("fade-in");

      poweredByLogo.style.opacity = 1;
      poweredByLogo.classList.remove("fade-in");

      controls.style.display = "none";
      controls.style.opacity = 0;
      controls.classList.remove("fade-out");
    }, 300);

    setTimeout(() => {
      clearTimeout(styleCleanup);
    }, 900);
  };

  const toggleFullscreen = () => {
    document
      .getElementById(IFRAME_ID)
      .classList.toggle(FULLSCREEN_IFRAME_CLASS);
    document
      .getElementById(CONTROLS_ID)
      .classList.toggle(FULLSCREEN_CONTROLS_CLASS);
    document
      .getElementById(EXPAND_BTN_ID)
      .classList.toggle(FULLSCREEN_EXPAND_BTN_CLASS);
    document
      .getElementById(STOP_BTN_ID)
      .classList.toggle(FULLSCREEN_STOP_BTN_CLASS);
  };

  const startAR = () => {
    const iframe = document.getElementById(IFRAME_ID);
    const controls = document.getElementById(CONTROLS_ID);

    const startBtn = document.getElementById(START_BTN_ID);
    console.log("startBtnstartBtnstartBtn", startBtn);
    startBtn != null && startBtn.classList.add("fade-out");

    // checks if camera has been accepted in iframe before displaying controls
    window.addEventListener("message", (event) => {
      if (event.data !== "acceptedCamera") {
        return;
      }

      controls.style.opacity = 0;

      const styleCleanup = setTimeout(() => {
        startBtn.style.display = "none";

        controls.style.display = "block";
      }, 300);

      const uiFadeIn = setTimeout(() => {
        controls.classList.add("fade-in");
      }, 800);

      setTimeout(() => {
        clearTimeout(styleCleanup);
        clearTimeout(uiFadeIn);
      }, 900);
    });

    iframe.setAttribute("src", INNER_FRAME_URL); // This is where the AR iframe's source is set.
  };

  const onLoad = () => {
    createObserver(); // handles intersection observer behavior
    dateCheck(); // sets today's date in the article
  };

  // Add event listeners and callbacks for the body DOM.
  window.addEventListener("load", onLoad, false);
  window.toggleFullscreen = toggleFullscreen;
  window.startAR = startAR;
  window.stopAR = stopAR;

  return (
    <div id="inline-ar">
      <button id="startBtn" onClick={startAR}>
        <img src="./assets/outer-website-assets/start-ar-banner.svg" />
      </button>
      <div id="iframeControls">
        <button id="expandBtn" onClick={toggleFullscreen}>
          <div id="expandImg"></div>
        </button>
        <button id="stopBtn" onClick={stopAR}>
          <div id="stopImg"></div>
        </button>
      </div>
      <iframe
        id="my-iframe"
        allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"
      ></iframe>
    </div>
  );
};

export default ARScene;
