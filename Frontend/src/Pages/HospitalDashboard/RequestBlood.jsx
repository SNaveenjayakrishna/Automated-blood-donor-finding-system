import React, { useState } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import { validateMobile } from "../utils/validateMobile";
import messageStyles from "../../styles/messages.module.css";

const RequestBlood = () => {
  const [patientName, setPatientName] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientAge, setPatientAge] = useState("")
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [units, setUnits] = useState("");
  const [requiredDate, setRequiredDate] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName || !patientGender || !patientAge || !contactName ||!contactPhone || !urgencyLevel || !requiredDate  || !bloodGroup || !units) {
      setMessage("All fields are required");
      return;
    }

    const mobileCheck = validateMobile(mobile);
      if (mobileCheck !== "valid") {
        setMessage(mobileCheck);
        return;
      }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BACKEND_URL}/hospital_request_blood`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          patient_name: patientName, 
          patient_gender: patientGender, 
          patient_age: patientAge ? parseInt(patientAge) : null,
          contact_name: contactName, 
          contact_phone: contactPhone, 
          blood_group: bloodGroup, 
          urgency_level: urgencyLevel, 
          units: parseInt(units), 
          required_date: requiredDate, 
          }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Blood request submitted successfully");
        setPatientName(""); 
        setPatientGender(""); 
        setPatientAge("");
        setContactName(""); 
        setContactPhone(""); 
        setBloodGroup(""); 
        setUrgencyLevel(""); 
        setUnits(""); 
        setRequiredDate("");
  
      } else {
        setMessage((data.message +". "+ data.error )|| "Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cardStyles.card}>
      <h3>Request Blood</h3>
      {message && <p className={messageStyles.message}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" className={inputStyles.input} placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />

        <select className={inputStyles.input} value={patientGender} onChange={(e) => setPatientGender(e.target.value)} required > 
          <option value="">Patient Gender</option> 
          <option value="Male">Male</option> 
          <option value="Female">Female</option> 
          <option value="Other">Other</option> 
        </select>

        <input type="number" className={inputStyles.input} placeholder="Patient Age" value={patientAge} onChange={(e) => setPatientAge(e.target.value)}/>

        <input type="text" className={inputStyles.input} placeholder="Contact Person Name" value={contactName} onChange={(e) => setContactName(e.target.value)} required />

        <input type="tel" className={inputStyles.input} placeholder="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />

        <select className={inputStyles.input} value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required>
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

        <select className={inputStyles.input} value={urgencyLevel} onChange={(e) => setUrgencyLevel(e.target.value)} required > 
          <option value="">Urgency Level</option> 
          <option value="normal">Normal</option> 
          <option value="urgent">Urgent</option> 
          <option value="critical">Critical</option>
         </select>

        <input type="number" className={inputStyles.input} placeholder="Units required" value={units} onChange={(e) => setUnits(e.target.value)} min={1} required />

        <input type="date" className={inputStyles.input} value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)} required />


        <button type="submit" className={`${buttonStyles.btn} ${buttonStyles["btn-primary"]}`} disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default RequestBlood;
