import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import tableStyles from "../../styles/tables.module.css";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import modalStyles from "../../styles/modal.module.css";

import AvailableDonors from "./AvailableDonors";
import Available_External_Donors from "./AvailableExternalDonors";

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [units, setUnits] = useState("");
  const [showExtendRequest, setShowExtendRequest] = useState(false)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${BACKEND_URL}/hospital_requests`, { method: "GET", credentials: "include" });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        setRequests(data.requests || []);

      } catch (err) {
        console.log(err);
        setError("Unable to load requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleExtendRequest = async (id) => {

    if (!units) {
    alert("Units is required");
    return;
  }

  try{
  const response = await fetch(`${BACKEND_URL}/extend_request/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ units: parseInt(units) })
  });
 const data = await response.json();

    if (response.ok) {
      alert(data.message);
      
      setShowExtendRequest(false);
      setUnits("");
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.error("Error:", error);
    alert(error);
  }
};


useEffect(() => {
  const filtered = requests.filter((req) => {
    const units = req.units_required != null ? String(req.units_required) : "";

    return (
      (req.address || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.blood_group || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.urgency_level || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (String(req.accepted_count) || "").includes(searchQuery) ||
      units.includes(searchQuery)
    );
  });

  setFilteredRequests(filtered);
}, [searchQuery, requests]);

  if (loading) return <p className={cardStyles.card}>Loading requests...</p>;
  if(error) return <p className={cardStyles.card}>{error}</p>;
  if (!requests.length) return <p className={cardStyles.card}>No requests yet.</p>;

  return (
    <div className={cardStyles.card}>
      <h3>My Blood Requests</h3>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={inputStyles.searchInput}
      />
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Blood Group</th>
              <th>Units</th>
              <th>Urgency</th>
              <th>Available Donors Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {filteredRequests.map((req, index) => (
            <tr key={req.id}>
              <td>{index+1}</td>
              <td>{req.blood_group}</td>
              <td>{req.units_required}</td>
              <td>{req.urgency_level}</td>
              <td>{req.accepted_count}</td>
            {/*new Date(req.created_at).toLocaleString()*/}
            <td>
              <button className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
              onClick={() => setSelectedRequest(req)}>
                Manage
              </button>            
            </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
   <div className={modalStyles.overlay} onClick={() => setSelectedRequest(null)}>
  <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}> {/*e.stopPropagation() -when we click the modal it stops the click event from moving to the parent(overlay).*/}
    
       <button
        className={modalStyles.closeBtn}
        onClick={() => {
          setSelectedRequest(null);
        }}
      >
        ✕
      </button>
    <h3>Request Details</h3>

    <p><b>Patient Name:</b> {selectedRequest.patient_name}</p>
    <p><b>Patient Age:</b> {selectedRequest.patient_age}</p>
    <p><b>Blood Group:</b> {selectedRequest.blood_group}</p>
    <p><b>Patient Gender:</b> {selectedRequest.patient_gender}</p>
    <p><b>Contact Person:</b> {selectedRequest.contact_name}</p>
    <p><b>Contact Number:</b> {selectedRequest.contact_phone}</p>
    <p><b>Urgency Level:</b> {selectedRequest.urgency_level}</p>
    <p><b>Required At:</b> {selectedRequest.required_date}</p>
    <p><b>Units Required:</b> {selectedRequest.units_required}</p>
     <hr/>
    <p><b>Call Summary</b></p>
    <p><b>Total Donor Count:</b> {selectedRequest.total_count}</p>
    <p><b>Accepted Donor Count:</b> {selectedRequest.accepted_count}</p>
    <p><b>Declined Donor Count:</b> {selectedRequest.declined_count}</p>
    <p><b>Remaining Donor Count:</b> {selectedRequest.remaining_count}</p>
    <p><b>Not Answered Donor Count:</b> {selectedRequest.no_respone_count}</p>   



    <div style={{ marginTop: "15px" }}>
    
          <button
            className={`${buttonStyles.btn} ${buttonStyles["btn-warning"]}`}
            style={{ marginLeft: "10px" }}
            onClick={() => setShowExtendRequest(!showExtendRequest)}
          >
          Extend Request
          </button>
    
    
          {showExtendRequest && (
          <div style={{ marginTop: "15px" }}>
          <input
          type="text"
          placeholder="Enter the number of units of required Additionally"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          className={inputStyles.searchInput}
          
        />
        <button
          className={`${buttonStyles.btn} ${buttonStyles["btn-danger"]}`}
          style={{ marginLeft: "10px" }}
          onClick={() => handleExtendRequest(selectedRequest.id)}
        >
          Extend Request
        </button>
      </div>
    )}

</div>

    <h3>Available Donors</h3>

    <AvailableDonors id = {selectedRequest.id}/>
    <h3>Available External Donors</h3>
    <Available_External_Donors id = {selectedRequest.id}/>
   </div>
  </div>
)}



      <div className={cardStyles.mobileCards}>
        {filteredRequests.map((req, index) => (
            <div key={req.id} className={cardStyles.requestcard}>
              <p><b>S.NO.</b> {index+1}</p>
              <p>🩸{req.blood_group} | {req.units_required} {req.units_required>1?"Units":"Unit"}</p>
              <p>🚨<b>Urgency Level:</b> {req.urgency_level}</p>
              <p>👥<b>Available Donors Count: </b>{req.accepted_count}</p>
               <button className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                onClick={() => setSelectedRequest(req)}>
                  Manage
                </button>
              </div>
            ))}
        </div>
    </div>
  );
};

export default RequestHistory;
