import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../styles/forms.module.css";
import style_2 from "../Signup/signup.module.css";
import LocationPicker from "../Location/LocationPicker";
import { validatePassword } from "../utils/validatePassword";
import { BACKEND_URL } from "../../config/apiConfig";

const HospitalSignup = ({ mobile }) => {
  const navigate = useNavigate();

  const [hospitalName, setHospitalName] = useState("");

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [passwordCheckMsg, setPasswordCheckMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordCheck = validatePassword(password);
    if (passwordCheck !== "valid") {
      setPasswordCheckMsg(passwordCheck);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordCheckMsg("Passwords don't match");
      return;
    }
    setPasswordCheckMsg("");

    const body = {
      hospital_name: hospitalName,
      registrationNumber: registrationNumber,
      mobile: mobile,
      address: address,
      city: city,
      district: district,
      state: state,
      country: country,
      pincode: pincode,
      password: password,
      // type: "hospital",
      latitude: latitude,
      longitude: longitude,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/hospital_signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        navigate("/"); // redirect to login after success
      } else {
        setMessage(data.message || "Hospital registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error during registration");
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
    <div className={style.loginBody}>
      <div className={style.loginContainer}>
        <form
          onSubmit={handleSubmit}
          className={`${style.loginform} ${style_2.signupform}`}
        >
          <h2>Hospital Registration</h2>
          {message && <p style={{ color: "red" }}>{message}</p>}

          <>
            <label>Hospital Name:</label>
            <input
              placeholder="Hospital Name"
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              required
            />

            <label>Hospital Registration Number:</label>
            <input
              placeholder="Hospital Registration Number"
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
            />

            <label>Select Hospital Location : </label>
            <LocationPicker setLocation={handleLocationSelect} />
            {latitude && longitude && (
              <p style={{ fontSize: "13px", color: "green" }}>
                Location Selected ✔ ({latitude.toFixed(4)},{" "}
                {longitude.toFixed(4)})
              </p>
            )}
            <label>Address:</label>
            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <label htmlFor="city">City :</label>
            <input
              placeholder="city"
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <label htmlFor="district">District :</label>
            <input
              placeholder="District"
              type="text"
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
            <label htmlFor="state">State :</label>
            <input
              placeholder="State"
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <label htmlFor="country">Country :</label>
            <input
              placeholder="country"
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            <label htmlFor="pincode">Pincode :</label>
            <input
              placeholder="pincode"
              type="number"
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
            />

            <label>
              Password :
              <small>
                (must include min 8 char, A-Z, a-z, 0-9, and a special
                character)
              </small>
            </label>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirm Password:</label>
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordCheckMsg && (
              <p style={{ color: "red" }}>{passwordCheckMsg}</p>
            )}
            <button type="submit">Register Hospital</button>
          </>
        </form>
      </div>
    </div>
  );
};

export default HospitalSignup;
