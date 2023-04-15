import { Loader } from "@googlemaps/js-api-loader";
import { MAP_PANE } from "@react-google-maps/api";
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

let markerArr = [];
let userMarker;
let webGLOverlayView;

export function setMarkers(markers, map) {
  const google = window.google;

  //Clean Map
  markerArr.forEach((marker) => {
    marker.setMap(null);
    markerArr = [];
  });

  for (const key in markers) {
    let img = document.createElement("img");
    img.src =
      "https://firebasestorage.googleapis.com/v0/b/sideworld-93e4c.appspot.com/o/user%2FaQnaxIzANMVdby1hIqBVqbMt4yi2%2FADCF421A-30EF-45FE-97E9-49408A624A0B.jpeg?alt=media&token=725668ef-b4d7-4b2f-b84e-94147400db68";
    img.style.width = "500px";
    img.style.height = "500px";

    getFile(markers[key]["content"]["attachment"]["img"]["path_"]).then(
      (iconBase) => {
        let markerPos = {
          lat: markers[key]["location"].lat,
          lng: markers[key]["location"].long,
        };
        let marker = new google.maps.Marker({
          position: markerPos,
          map: map,
          icon: {
            url: iconBase,
            scaledSize: new google.maps.Size(100, 100),
          },
        });
        markerArr.push(marker);
      }
    );
  }

  //Populate Map
  markerArr.forEach((marker) => {
    marker.setMap(map);
  });
}

export function getMapLocation(position, map) {
  console.log("MAP LOCATION REQUESTED");
  if (userMarker != undefined) {
    userMarker.close();
  }

  const google = window.google;
  userMarker = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  const pos = {
    lat: position.latitude,
    lng: position.longitude,
  };

  //Sets user location
  userMarker.setPosition(pos);
  userMarker.setContent("You're here!");

  //Centers map on user location
  userMarker.open(map);

  let mapOptions = {
    tilt: 0,
    heading: 0,
    zoom: 18,
    center: pos,
    mapId: "fd96cc9ffed49009",
  };

  return mapOptions;
}

export async function initMap() {
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  console.log("apiLoader", apiLoader)
  const google = window.google;

  return new google.maps.Map(mapDiv, mapOptions);
}

export async function closeMap() {
  webGLOverlayView.setMap(null);
  const mapDiv = document.getElementById("map");
  mapDiv.innerHTML = "";
}

export async function initWebGLOverlayView(map) {
  
  let scene, renderer, camera, loader;
  const google = window.google;
  webGLOverlayView = new google.maps.WebGLOverlayView();
  // webGLOverlayView.setMap(null);
  console.log("analyze GL map object", webGLOverlayView);

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
    // scene.add(cube);
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

  webGLOverlayView.onRemove = () => {
    // Remove all intermediate objects
    console.log("UWU", scene);
    // google = null;
    // dispose of the scene and its resources
  };

  webGLOverlayView.onDraw = ({ gl, transformer }) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map
    const latLngAltitudeLiteral = {
      lat: mapOptions.center.lat,
      lng: mapOptions.center.lng,
      altitude: 120,
    };

    // webGLOverlayView.onDraw = null;
    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

    webGLOverlayView.requestRedraw();
    renderer.render(scene, camera);

    // always reset the GL state
    renderer.resetState();

    // console.log("rendererrenderer");
    
  };
  webGLOverlayView.setMap(map);
  return webGLOverlayView;
}
