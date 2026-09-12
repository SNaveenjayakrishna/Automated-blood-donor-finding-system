import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../styles/forms.module.css";
import style_2 from "./signup.module.css";
import LocationPicker from "../Location/LocationPicker";
import { validateDob } from "../utils/validateDob";
import { validatePassword } from "../utils/validatePassword";
import { BACKEND_URL } from "../../config/apiConfig";

const DonorSignup = ({ mobile }) => {
  const navigate = useNavigate();

  const [confirm_password, setConfirmPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [isDobValid, setIsDobValid] = useState(false);
  const [weight, setWeight] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");

  const [bloodgroup, setBloodGroup] = useState("");
  const [lastDonated, setLastDonated] = useState(false);
  const [availability, setAvailability] = useState(true);
  const [lastDonationDate, setLastDonationDate] = useState(null);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [passwordCheckMsg, setPasswordCheckMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!mobile || !name || !new_password || !dob) {
      setMessage("Please fill all required fields");
      return;
    }
    if (!latitude || !longitude) {
      setMessage("Please select your location on the map");
      return;
    }

    if (!isDobValid) {
      return setMessage("Age must be greater than 18 years old");
    }
    const passwordCheck = validatePassword(new_password);

    if (passwordCheck !== "valid") {
      setPasswordCheckMsg(passwordCheck);
      return;
    }
    if (new_password != confirm_password) {
      setPasswordCheckMsg("Passwords don't match");
      return;
    }

    const body = {
      name: name,
      mobile: mobile,
      dob: dob,
      weight: weight,
      address: address,
      city: city,
      district: district,
      state: state,
      country: country,
      pincode: pincode,
      bloodgroup: bloodgroup,
      availability: availability,
      lastDonationDate: lastDonationDate,
      password: new_password,
      latitude: latitude,
      longitude: longitude,
      // type: "signup",
    };

    try {
      const res = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        navigate("/");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error during signup");
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

  const handleDobChange = (e) => {
    const selectedDate = e.target.value;
    setDob(selectedDate);

    const valid = validateDob(selectedDate);
    setIsDobValid(valid);

    if (!valid) {
      setMessage("Age must be greater than 18 years old");
    } else {
      setMessage("");
    }
  };

  return (
    <div className={style.loginBody}>
      <div className={style.loginContainer}>
        <form
          onSubmit={handleSubmit}
          className={`${style.loginform} ${style_2.signupform}`}
        >
          <h2>Signup</h2>
          {message && <p style={{ color: "red" }}>{message}</p>}

          <>
            <label htmlFor="name">Name :</label>
            <input
              placeholder="Name"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="dob">Date of Birth :</label>
            <input
              placeholder="Date of Birth"
              max={new Date().toISOString().split("T")[0]}
              id="dob"
              type="date"
              value={dob}
              onChange={handleDobChange}
              required
            />

            <label htmlFor="weight">Weight(in KG) :</label>
            <input
              placeholder="Weight"
              id="weight" // Corrected id from "age" to "weight"
              type="number"
              min={51}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <label>Set Your Location (Use GPS or Click on Map):</label>
            <LocationPicker setLocation={handleLocationSelect} />
            {latitude && longitude && (
              <p style={{ fontSize: "13px", color: "green" }}>
                Location Selected ✔ ({latitude.toFixed(4)},{" "}
                {longitude.toFixed(4)})
              </p>
            )}
            {/*address && (
                <p style={{ color: "#333" }}>
                📍 {address}
                </p>
              )*/}
            {/* toFixed(4) - Rounds it to 4 decimal places
                e.target.value means “the current value of the input field where the event happened.”
              */}

            <label htmlFor="address">Address :</label>
            <textarea
              placeholder="Address"
              id="address"
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
              type="text"
              pattern="\d{6}"
              maxLength={6}
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
            />

            <label htmlFor="bloodgroup">Blood Group:</label>
            <select
              value={bloodgroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A1+">A1+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            <div className={style_2.checkbox}>
              <input
                type="checkbox"
                id="lastDonated"
                checked={lastDonated}
                onChange={(e) => setLastDonated(e.target.checked)}
              />
              <label htmlFor="lastDonated">I have previously Donated</label>
            </div>

            {lastDonated && (
              <>
                <label htmlFor="lastDonatedDate">Last Donation Date :</label>
                <input
                  id="lastDonatedDate"
                  type="date"
                  name="lastDonatedDate"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  required
                />
              </>
            )}

            <div className={style_2.checkbox}>
              <input
                type="checkbox"
                id="availability"
                checked={availability}
                onChange={(e) => setAvailability(e.target.checked)}
              />
              <label htmlFor="availability">Available to donate blood</label>
            </div>

            <label htmlFor="new_password">
              Password :
              <small>
                (must include min 8 char, A-Z, a-z, 0-9, and a special
                character)
              </small>
            </label>
            <input
              placeholder="Password"
              id="new_password"
              type="password"
              value={new_password}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label htmlFor="confirm_password">Confirm Password :</label>
            <input
              placeholder="Confirm Password"
              id="confirm_password"
              type="password"
              value={confirm_password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordCheckMsg && (
              <p style={{ color: "red" }}>{passwordCheckMsg}</p>
            )}

            <button type="submit">Submit</button>
          </>
        </form>
      </div>
    </div>
  );
};

export default DonorSignup;
