import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  ZoomControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* -------------------- Auto Center Map -------------------- */
const ChangeMapView = ({ center }) => {
  const map = useMap();
  map.setView(center, 15);//centers the map to the passed Coordinates(center) , and sets the zoom level 15
  return null;
};

/* -------------------- Marker Component -------------------- */
const LocationMarker = ({ position, setPosition, setLocation }) => {
  useMapEvents({
    async click(e) { //trigerred when user clicks anywhere in the map
      const { lat, lng } = e.latlng;
      updateLocation(lat, lng);
    },
  });

  const updateLocation = async (lat, lng) => {
    setPosition([lat, lng]);

    try {
      const response = await fetch(
        `${BACKEND_URL}/reverse_geocode?lat=${lat}&lon=${lng}`
       
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();
      const addr = data.address || {};
      const fullAddress = [addr.name, addr.amenity, addr.road, addr.village, addr.suburb, addr.county]
      .filter(Boolean) // remove null, undefined, empty strings
      .join(", "); 

      setLocation({
        address: fullAddress,
        city: addr.city || addr.town || addr.county || addr.village || "",
        district: addr.state_district || "",
        state: addr.state || "",
        pincode: addr.postcode || "",
        country: addr.country || "",
        latitude: lat,
        longitude: lng,
      });
    } catch (error) {
      console.error("Reverse geocode error:", error);
    }
  };

  return position ? (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          updateLocation(lat, lng);
        },
      }}
    />
  ) : null;
  /*Shows a map marker if position exists.
Lets the user drag the marker.
When the drag finishes, it calls updateLocation with the new coordinates,
 so your app knows the marker’s new location.*/ 
};

/* -------------------- Main Component -------------------- */
const LocationPicker = ({ setLocation }) => {
  const [position, setPosition] = useState(null);

  /* -------------------- GPS Auto Detect -------------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      //console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try { //pos.coords contains the latitude and longitude of the device.
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          setPosition([lat, lng]); //updating map position

          const response = await fetch(
            `${BACKEND_URL}/reverse_geocode?lat=${lat}&lon=${lng}`
            
          );

          if (!response.ok) throw new Error("Geocoding failed");

          const data = await response.json();
          const addr = data.address || {};
          const fullAddress = [addr.name, addr.amenity, addr.road, addr.village, addr.suburb, addr.county]
          .filter(Boolean)
          .join(", ");
          setLocation({
            address: fullAddress,
            city: addr.city || addr.town || addr.village || addr.county ||"",
            district: addr.state_district || "",
            state: addr.state || "",
            pincode: addr.postcode || "",
            country: addr.country || "",
            latitude: lat,
            longitude: lng,
          });
        } catch (err) {
          console.error("GPS reverse geocode error:", err);
        }
      },
      (err) => {
        console.error("Location permission denied", err);
      }
    );
  }, []);

  return (
    <MapContainer
      center={position || [13.0843, 80.2705]} // Default Chennai
      zoom={position ? 15 : 5}
      zoomControl={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ZoomControl position="bottomright" />
      {position && <ChangeMapView center={position} />}
      <LocationMarker
        position={position}
        setPosition={setPosition}
        setLocation={setLocation}
      />
    </MapContainer>
  );
};

export default LocationPicker;
