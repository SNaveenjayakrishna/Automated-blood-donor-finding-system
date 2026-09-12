import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config/apiConfig";
import LocationPicker from "../Location/LocationPicker";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import messageStyles from "../../styles/messages.module.css";

const EditProfile = ({ hospital, setHospital }) => {
  const navigate = useNavigate();
  const [hsName, setHsName] = useState(hospital.name || "");
  const [registrationNumber, setRegistrationNumber] = useState(
    hospital.registrationNumber || "",
  );
  const [address, setAddress] = useState(hospital.address || "");
  const [city, setCity] = useState(hospital.city || "");
  const [district, setDistrict] = useState(hospital.district || "");
  const [state, setState] = useState(hospital.state || "");
  const [country, setCountry] = useState(hospital.country || "");
  const [pincode, setPincode] = useState(hospital.pincode || "");
  const [latitude, setLatitude] = useState(hospital.latitude || null);
  const [longitude, setLongitude] = useState(hospital.longitude || null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !hsName ||
      !address ||
      !city ||
      !district ||
      !state ||
      !country ||
      !pincode ||
      !registrationNumber ||
      !latitude ||
      !longitude
    ) {
      setMessage("Please fill all required fields......");
      return;
    }

    try {
      const res = await fetch(
        `${BACKEND_URL}/update_hospital/${hospital.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hs_name: hsName,
            address,
            city,
            district,
            state,
            country,
            pincode,
            latitude,
            longitude,
            registrationNumber,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setHospital((prev) => ({
          ...prev,
          name: hsName,
          address: address,
          city: city,
          district: district,
          state: state,
          country: country,
          pincode: pincode,
          registrationNumber: registrationNumber,
          latitude: latitude,
          longitude: longitude,
        }));
        //This line updates specific fields of the hospital object while keeping the rest of the state unchanged using the spread operator and functional state update.

        setMessage("Profile updated successfully");
        setTimeout(() => navigate("/hospital/dashboard"), 1500);
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile");
    }
  };

  const handleLocationSelect = (location) => {
    setLatitude(location.latitude);
    setLongitude(location.longitude);
    setAddress(location.address);
    setCity(location.city);
    setDistrict(location.district);
    setState(location.state);
    setCountry(location.country);
    setPincode(location.pincode);
  };

  return (
    <div className={cardStyles.card} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h3>Edit Hospital Profile</h3>
      {message && <p className={messageStyles.message}>{message}</p>}

      <form onSubmit={handleSubmit} className={inputStyles.form}>
        <div className={inputStyles.inputfield}>
          <label>Hospital Name</label>
          <input
            type="text"
            className={inputStyles.input}
            value={hsName}
            onChange={(e) => setHsName(e.target.value)}
            required
          />
        </div>

        <div className={inputStyles.inputfield}>
          <label>Hospital Registration Number</label>
          <input
            type="text"
            className={inputStyles.input}
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
          />
        </div>

        <div className={cardStyles.card}>
          <LocationPicker setLocation={handleLocationSelect} />
          {latitude && longitude && (
            <p>
              <strong>Selected:</strong> {latitude}, {longitude}
            </p>
          )}
        </div>

        <div className={inputStyles.inputfield}>
          <label>Address:</label>
          <textarea
            className={inputStyles.input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className={inputStyles.groupedInputFields}>
          <div className={inputStyles.inputfield}>
            <label>City </label>
            <input
              id="city"
              className={inputStyles.input}
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className={inputStyles.inputfield}>
            <label>District </label>
            <input
              id="district"
              className={inputStyles.input}
              placeholder="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={inputStyles.groupedInputFields}>
          <div className={inputStyles.inputfield}>
            <label>State </label>
            <input
              id="state"
              className={inputStyles.input}
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>

          <div className={inputStyles.inputfield}>
            <label>Country </label>
            <input
              id="country"
              className={inputStyles.input}
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
        </div>
        <div className={inputStyles.inputfield}>
          <label>Pincode </label>
          <input
            id="pincode"
            className={inputStyles.input}
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={`${buttonStyles.btn} ${buttonStyles["btn-primary"]}`}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
