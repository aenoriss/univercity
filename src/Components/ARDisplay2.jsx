import React, { useRef, useEffect, useState, ReactDOM } from "react";
import "aframe";
import "aframe-ar";

const ARScene = ({ selectedReverie }) => {

  //Add Reverie
  useEffect(() => {
    let scene = document.querySelector('a-scene');

    //Displayed Reverie
    let model = document.createElement('a-box');
    model.setAttribute('gps-entity-place', `latitude: ${selectedReverie["userPos"].lat}; longitude: ${selectedReverie["userPos"].long};`);
    model.setAttribute("material", "color" , "red");

    
    window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
    // model.setAttribute('rotation', '0 180 0');
    scene.appendChild(model);

  }, [selectedReverie]);

  return (
    <a-scene
      vr-mode-ui="enabled: false"
      embedded
      arjs="sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false;"
    >
      <a-camera gps-camera rotation-reader></a-camera>
    </a-scene>
  );
};

export default ARScene;
