// components/Dashboard/Requests.jsx
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import tableStyles from "../../styles/tables.module.css";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import modalStyles from "../../styles/modal.module.css";
import messageStyles from "../../styles/messages.module.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/requests`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setRequests(data.requests || []);
      else console.error(data.message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);


 const updateWillingness = async (request_id) => {
  try {
    const res = await fetch(`${BACKEND_URL}/update_donation_willingness?request_id=${request_id}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      alert("Willing to donate confirmed");
      setSelectedRequest(null);
      fetchRequests();
    } else {
      console.error(data.message);
    }

  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const filtered = requests.filter(request => {
    // Convert units to string to safely use includes
    const units = request.units_required != null ? String(request.units_required) : "";

      return (
    (request.hs_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (request.contact_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (request.contact_phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (request.patient_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (request.urgency_level || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (request.address || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (request.mobile_number || "").includes(searchQuery) ||
    (request.blood_group || "").includes(searchQuery) ||
    (request.created_at || "").includes(searchQuery) ||
    units.includes(searchQuery)
  );
  });

  setFilteredRequests(filtered);
}, [searchQuery, requests]);


  if (loading) return <p className={messageStyles.loading}>Loading requests...</p>;
  if (!requests.length) return <p>No requests yet.</p>;

  return (
    <div className={cardStyles.card}>
      <h3>Blood Requests</h3>
      <input
          type="text"
          placeholder="Search by hospital name, address or mobile..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={inputStyles.searchInput}
      />
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Hospital Name</th>
              <th>Blood Group</th>
              <th>Units</th>
              <th>Action</th>
           
            
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) =>
              <tr key={request.id}>
                <td>{index+1}</td>
                <td>{request.hs_name}</td>
               
                <td >{request.blood_group}</td>
                <td>{request.units_required}</td>
                <td>
                  <button className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                    onClick={() => setSelectedRequest(request)}>
                      Manage
                  </button>            
                </td>
              </tr>
            )}
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
    <p><b>Hospital Name:</b>{selectedRequest.hs_name}</p>
    <p><b>Hospital Address:</b>{selectedRequest.address}</p>
    <p><b>Hospital Mobile:</b>{selectedRequest.mobile_number}</p>
    <p><b>Patient Name:</b> {selectedRequest.patient_name}</p>
    <p><b>Patient Age:</b> {selectedRequest.patient_age}</p>
    <p><b>Patient Gender:</b> {selectedRequest.patient_gender}</p>
    <p><b>Contact Person:</b> {selectedRequest.contact_name}</p>
    <p><b>Contact Number:</b> {selectedRequest.contact_phone}</p>
    <p><b>Urgency Level:</b> {selectedRequest.urgency_level}</p>
    {/*<p><b>Required At:</b> {selectedRequest.required_date}</p>*/}
    <p><b>Required At:</b> {new Date(selectedRequest.required_date).toLocaleString()}</p>
    <p><b>Units Required:</b> {selectedRequest.units_required}</p>

    <button className={`${buttonStyles.btn} ${buttonStyles["btn-primary"]}`} onClick={() => updateWillingness(selectedRequest.id)} disabled={selectedRequest.is_accepted || selectedRequest.accepted_count == selectedRequest.units_required}>{selectedRequest.is_accepted ?"Already Accepted To Donate": selectedRequest.accepted_count == selectedRequest.units_required ?"Max Count Reached":"Available To Donate"}</button>
   </div>
  </div>
)}
            <div className={cardStyles.mobileCards}>
              {filteredRequests.map((request, i) => (
                <div key={i} className={cardStyles.requestcard}>
                  <p><b>S.No </b>{i+1}</p>
                  <p>🏥 {request.hs_name}</p>
                  <p>🩸 {request.blood_group} | {request.units_required} {request.units_required>1?"Units":"Unit"} </p>
                  
                  <button className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                    onClick={() => setSelectedRequest(request)}>
                      Manage
                  </button>            
                </div>
                ))}
            </div>
    </div>
  );
};

export default Requests;
