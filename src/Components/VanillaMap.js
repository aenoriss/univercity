import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { getFile } from "../Utils/firebase";

const apiOptions = {
  apiKey: "AIzaSyAo7v_SfcffemdotwZkN2cJ4iww4HIHuCQ",
};

const mapOptions = {
  tilt: 0,
  heading: 0,
  zoom: 18,
  center: { lat: 37.773972, lng: -122.431297 },
  mapId: "fd96cc9ffed49009",
  styles: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
  ],
};

function getLocation(map, markers) {
  const google = window.google;
  let infoWindow = new google.maps.InfoWindow();
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      let mapOptions = {
        tilt: 0,
        heading: 0,
        zoom: 18,
        center: pos,
        mapId: "fd96cc9ffed49009",
      };
      // console.log("Latitude is :", position.coords.latitude);
      // console.log("Longitude is :", position.coords.longitude);
      infoWindow.setPosition(pos);
      infoWindow.setContent("You're here!");

      for (const key in markers) {
        let img = document.createElement("img");
        console.log("img", img)
        img.src =
          "https://firebasestorage.googleapis.com/v0/b/sideworld-93e4c.appspot.com/o/user%2FxWwGXF0nOmSTVXW0lOeZSWR5loE3%2Faenoris%20circle.png?alt=media&token=c2458960-3385-4b36-a0c4-16a5c09ac960";
        img.style.width = "500px";
        img.style.height = "500px";
      

        getFile(markers[key]["content"]["attachment"]["img"]["path_"]).then((iconBase)=> {

          console.log("iconBase", iconBase)
          let markerPos = {
            lat: pos.lat + (Math.random() - 0.5) * 0.01,
            lng: pos.lng + (Math.random() - 0.5) * 0.01,
          };
  
          console.log("marketPos", markerPos);
          
          new google.maps.Marker({
            position: markerPos,
            map: map,
            icon: iconBase ,
          });
        })
      }

      infoWindow.open(map);
    });
  }
  return mapOptions;
}

async function initMap() {
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  const google = window.google;
  return new google.maps.Map(mapDiv, mapOptions);
}

function initWebGLOverlayView(map) {
  let scene, renderer, camera, loader;
  const google = window.google;
  const webGLOverlayView = new google.maps.WebGLOverlayView();

  const customStyled = [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

  map.set("styles", customStyled);

  function latLngAltitudeToVector3(latLngAltitude) {
    const { lat, lng, altitude } = latLngAltitude;
    const x = (lng + 180) / 360;
    const y =
      1 - Math.log(Math.tan(((lat + 90) * Math.PI) / 360)) / Math.PI / 2;
    const z = altitude;

    return new THREE.Vector3(x, y, z);
  }

  webGLOverlayView.onAdd = () => {
    // set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);

    // load the model
    loader = new GLTFLoader();
    const source = "fantasy_town.glb";
    loader.load(source, (gltf) => {
      gltf.scene.scale.set(40, 40, 40);
      gltf.scene.position.set(-280, 280, -130);
      gltf.scene.rotation.x = (90 * Math.PI) / 180; // rotations are in radians
      scene.add(gltf.scene);
    });

    const latLngAltitude = { lat: -34.479363, lng: -58.505597, altitude: 5 };
    const position = latLngAltitudeToVector3(latLngAltitude);
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    scene.add(cube);
  };

  webGLOverlayView.onContextRestored = ({ gl }) => {
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
          tilt: mapOptions.tilt,
          heading: mapOptions.heading,
          zoom: mapOptions.zoom,
        });

        // rotate the map 360 degrees
        if (mapOptions.tilt < 67.5) {
          mapOptions.tilt += 0.5;
        } else if (mapOptions.heading <= 360) {
          mapOptions.heading += 0.2;
        } else {
          renderer.setAnimationLoop(null);
        }
      });
    };
  };

  webGLOverlayView.onDraw = ({ gl, transformer }) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map
    const latLngAltitudeLiteral = {
      lat: mapOptions.center.lat,
      lng: mapOptions.center.lng,
      altitude: 120,
    };

    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

    webGLOverlayView.requestRedraw();
    renderer.render(scene, camera);

    // always reset the GL state
    renderer.resetState();
  };
  webGLOverlayView.setMap(map);
}

export default async function startMap(markers) {
  console.log("MARKERS", markers);
  const map = await initMap();
  getLocation(map, markers);
  initWebGLOverlayView(map);
}
