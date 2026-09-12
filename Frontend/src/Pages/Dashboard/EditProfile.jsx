// components/Dashboard/EditProfile.jsx
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import messageStyles from "../../styles/messages.module.css";

import {validateDob} from "../utils/validateDob";
import LocationPicker from "../Location/LocationPicker";

const EditProfile = ({ user, setUser }) => {
  const [name, setName] = useState(user.name || "");
  const [dob, setDob] = useState(user.dob ? new Date(user.dob).toISOString().split("T")[0]: "");
  const [weight, setWeight] = useState(user.weight || "");
  const [blood_group, setBlood_group] = useState(user.blood_group || "");
  const [address, setAddress] = useState(user.address || "");
  const [city , setCity] = useState(user.city || "");
  const [district , setDistrict] = useState(user.district || "");
  const [state , setState] = useState(user.state || "");
  const [country , setCountry] = useState(user.country || "");
  const [pincode , setPincode] = useState(user.pincode || "");
  const [latitude, setLatitude] = useState(user.latitude || null);
  const [longitude, setLongitude] = useState(user.longitude || null);
  const isDobValid = validateDob(dob);
  const [message, setMessage] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!name || !dob || !weight || !address || !city || !district || !state || !country || !pincode || !blood_group || latitude == null || longitude == null) {
      return setMessage("Please fill all required fields");
    }

    if(!isDobValid){
      return setMessage("Age must be greater than 18 years old");
    }
    
    try {
      const res = await fetch(`${BACKEND_URL}/update_user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          dob,
          weight,
          blood_group,
          address,
          city,
          district,
          state,
          country,
          pincode,
          latitude,
          longitude,
          
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        setUser((prev) => ({ ...prev, name: name, blood_group:blood_group, weight:weight, address: address, city:city, district:district, state:state, country:country, pincode:pincode, latitude:latitude, longitude:longitude}));
      } else {
        setMessage(data.message || "Update failed");
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
      <h3 style={{textAlign:"center"}}>Edit Profile</h3>
      {message && <p className={messageStyles.message}>{message}</p>}
      <form onSubmit={handleSubmit} className={inputStyles.form}>

        <div className={inputStyles.inputfield}>
          <label>Name </label>
          <input id="name" className={inputStyles.input} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className={inputStyles.groupedInputFields}>
        <div className={inputStyles.inputfield}>
        
       
          <label htmlFor="dob">Date of Birth :</label>
              <input className={inputStyles.dateInput}
                placeholder="Date of Birth"
                max={new Date().toISOString().split("T")[0]}
                id="dob"
                type="date"
                value={dob}
              onChange={(e) => setDob(e.target.value)}
                required
                />
          </div>
        <div className={inputStyles.inputfield}>
        <label>Weight </label>
        <input id="weight" type="number" min={51} className={inputStyles.input} placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        </div>
        </div>

<div className={inputStyles.inputfield}>
  <label>Blood Group</label>

  <select
    id="blood_group"
    className={inputStyles.input}
    value={blood_group}
    onChange={(e) => setBlood_group(e.target.value)}
    required
  >
    <option value="">Select Blood Group</option>
    <option value="A+">A+</option>
    <option value="A1+">A1+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
  </select>
</div>


        <div className={cardStyles.card}>
    
          <LocationPicker setLocation={handleLocationSelect} />
            {latitude && longitude && (
              <p><strong>Selected:</strong> {latitude}, {longitude}</p>
            )}
          </div>
      
        <div className={inputStyles.inputfield}>
          <label>Address </label>
        <textarea id="address" className={inputStyles.input} placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

      <div className={inputStyles.groupedInputFields}>
        <div className={inputStyles.inputfield}>
        <label>City </label>
        <input id="city" className={inputStyles.input} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>

        <div className={inputStyles.inputfield}>
        <label>District </label>
        <input id="district" className={inputStyles.input} placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} required />
        </div>
      </div>

      <div className={inputStyles.groupedInputFields}>
        <div className={inputStyles.inputfield}>
        <label>State </label>
        <input id="state"  className={inputStyles.input} placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
        </div>

        <div className={inputStyles.inputfield}>
        <label>Country </label>
        <input id="country" className={inputStyles.input} placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
      </div>
      <div className={inputStyles.inputfield}>
        <label>Pincode </label>
        <input id="pincode" className={inputStyles.input} placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
        </div>
        
        
        <button type="submit" className={`${buttonStyles.btn} ${buttonStyles["btn-primary"]}`}>Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
