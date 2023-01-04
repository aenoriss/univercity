import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';



export default function Map() {
  const [google, setGoogle] = useState(window.google)

  const apiOptions = {
    "apiKey": "AIzaSyAo7v_SfcffemdotwZkN2cJ4iww4HIHuCQ",
  };
  
  const mapOptions = {
    "tilt": 0,
    "heading": 0,
    "zoom": 18,
    "center": { lat: 37.773972, lng: -122.431297  },
    "mapId": "fd96cc9ffed49009",
    "styles": [
      {
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ]
  }

 

  
  
  async function initMap() {  
    const mapDiv = document.getElementById("map");
    const apiLoader = new Loader(apiOptions);
    await apiLoader.load()      
    const google = window.google;
    return new google.maps.Map(mapDiv, mapOptions);
  }
  
  function initWebGLOverlayView (map) {
    let scene, renderer, camera, loader;
    const google = window.google;
    const webGLOverlayView = new google.maps.WebGLOverlayView();


    const  customStyled = [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]

    map.set('styles',customStyled);



    console.log("mappppp", loader)

    // function getLocation(map) {
    //   let infoWindow = new google.maps.InfoWindow();
    
    //   const locationButton = document.createElement("button");
    //   locationButton.className = "btn";
    
    //   locationButton.textContent = "Pan to Current Location";
    //   locationButton.classList.add("custom-map-control-button");
    //   map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    //   locationButton.addEventListener("click", () => {
    //     // Try HTML5 geolocation.
    //     if (navigator.geolocation) {
    //       navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //           const pos = {
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude,
    //           };
    
    //           infoWindow.setPosition(pos);
    //           infoWindow.setContent("Location found.");
    //           infoWindow.open(map);
    //           mapOptions = {"tilt": 0,
    //             "heading": 0,
    //              "zoom": 18,
    //              "center": pos,
    //              "mapId": "fd96cc9ffed49009"
    //             }
    //         },
    //         () => {
    //           handleLocationError(true, infoWindow, map.getCenter());
    //         }
    //       );
    //     } else {
    //       // Browser doesn't support Geolocation
    //       handleLocationError(false, infoWindow, map.getCenter());
    //     }
    //   });
    // }
  
    webGLOverlayView.onAdd = () => {   
      // set up the scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera();
      const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
      directionalLight.position.set(0.5, -1, 0.5);
      scene.add(directionalLight);

      console.log("SCENEE", scene)
    
      // load the model    
      loader = new GLTFLoader();               
      const source = "fantasy_town.glb";
      loader.load(
        source,
        gltf => {      
          gltf.scene.scale.set(40,40,40);
          gltf.scene.position.set(-280,280,-130);
          gltf.scene.rotation.x = 90 * Math.PI/180; // rotations are in radians
          scene.add(gltf.scene);           
        }
      );
    }
    
    webGLOverlayView.onContextRestored = ({gl}) => {    
      // create the three.js renderer, using the
      // maps's WebGL rendering context.
      renderer = new THREE.WebGLRenderer({
        canvas: gl.canvas,
        context: gl,
        ...gl.getContextAttributes(),
      });

      renderer.autoClear = false;
  
      // wait to move the camera until the 3D model loads    
      loader.manager.onLoad = () => {        
        renderer.setAnimationLoop(() => {
          map.moveCamera({
            "tilt": mapOptions.tilt,
            "heading": mapOptions.heading,
            "zoom": mapOptions.zoom
          });            
          
          // rotate the map 360 degrees 
          if (mapOptions.tilt < 67.5) {
            mapOptions.tilt += 0.5
          } else if (mapOptions.heading <= 360) {
            mapOptions.heading += 0.2;
          } else {
            renderer.setAnimationLoop(null)
          }
        });        
      }
    }
  
    webGLOverlayView.onDraw = ({gl, transformer}) => {
      // update camera matrix to ensure the model is georeferenced correctly on the map
      const latLngAltitudeLiteral = {
          lat: mapOptions.center.lat,
          lng: mapOptions.center.lng,
          altitude: 120
      }
  
      const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
      camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
      
      webGLOverlayView.requestRedraw();      
      renderer.render(scene, camera);                  
  
      // always reset the GL state
      renderer.resetState();
    }
    webGLOverlayView.setMap(map);
  }

  useEffect(()=> {
    (async () => {        
      const map = await initMap();
      // getLocation(map);
      console.log("XDDD", map)
      initWebGLOverlayView(map);    
    })();
  })
  return (
    <div className="mapContainer">
    <div id="map"></div>
      <div id="button_container">
        <button id="Go">Sideddd World!</button>
      </div>
    </div>
  );
}
