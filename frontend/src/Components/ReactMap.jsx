import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
} from "react-google-maps";

export default function MapContainer() {
  const center = { lat: 44, lng: -80 };

  return withScriptjs(
    withGoogleMap((props) => {
      <GoogleMap zoom={10} center={center} mapContainerClassName="mapContainer">
        <Marker position={{ lat: 44, lng: -80 }} />
      </GoogleMap>;
    })
  );
}
