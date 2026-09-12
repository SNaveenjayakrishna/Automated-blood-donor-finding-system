import { useState, useEffect} from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import tableStyles from "../../styles/tables.module.css";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import modalStyles from "../../styles/modal.module.css";

const RejectedHospitals = () => {

    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredHospitals, setFilteredHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);




        const fetchHospitals = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/admin/rejected_hospitals`, { method: "GET", credentials: "include" });
        const data = await res.json();
        if (res.ok) setHospitals(data.hospitals);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
 useEffect(() => {
    fetchHospitals();
  }, []);


  useEffect(() => {
      const filtered = hospitals.filter(hospital =>
        hospital.hs_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.mobile_number.includes(searchQuery) ||
        String(hospital.verified_by || "").includes(searchQuery)||
        (hospital.verified_at || "").includes(searchQuery) 
  
      );
      setFilteredHospitals(filtered);
    }, [searchQuery, hospitals]);


const handleVerify = async (id) => {
  
  try {
    const response = await fetch(
      `${BACKEND_URL}/admin/approve_hospital/${id}`,
      {
        method: "POST",
        credentials: "include"
      }
    );
    
    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      await fetchHospitals();
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.error("Error:", error);
    alert(error);
  }
};


  if (loading) return <p className={cardStyles.card}>Loading hospitals...</p>;
  if (!hospitals.length) return <p className={cardStyles.card}>No Hopitals have been requested or added...</p>;

 return (
    <div className={cardStyles.card}>
      <h3>Hospitals</h3>
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
              <th>Name</th>
              <th>Mobile</th>
              <th>Registration Number</th>
           
              <th>Verified By</th>
              <th>Verified At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.map((hospital)=>(
              <tr key={hospital.id}>
                <td>{hospital.hs_name}</td>
                <td>{hospital.mobile_number}</td>
               
                <td>{hospital.registration_number}</td>
               
                <td>{hospital.verified_by ? hospital.verified_by : "--" }</td>
                <td>{hospital.verified_at ? hospital.verified_at :"—"}</td>
                <td>
                  <button className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                  onClick={() => setSelectedHospital(hospital)}>
                    Manage
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedHospital && (
   <div className={modalStyles.overlay} onClick={() => setSelectedHospital(null)}>
  <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}> {/*e.stopPropagation() -when we click the modal it stops the click event from moving to the parent(overlay).*/}
    
       <button
        className={modalStyles.closeBtn}
        onClick={() => {
          setSelectedHospital(null);
        
         
        }}
      >
        ✕
      </button>
    <h3>Hospital Details</h3>

    <p><b>Name:</b> {selectedHospital.hs_name}</p>
    <p><b>Mobile:</b> {selectedHospital.mobile_number}</p>
    <p><b>Registration:</b> {selectedHospital.registration_number}</p>
    <p><b>Address:</b> {selectedHospital.address}</p>
    <p><b>Verified By:</b> {selectedHospital.verified_by ?? "--"}</p>
    <p>
      <b>Verified At:</b>{" "}
      {selectedHospital.verified_at
        ? selectedHospital.verified_at
        : "--"}
    </p>

<p>
  <b>Status:</b>{" "}
  <span
    style={{
      color: selectedHospital.current_status === "approved" ? "green"
          : selectedHospital.current_status === "blocked"
          ? "red"
          : "orange",
      fontWeight: "bold",
    }}
  >
    {selectedHospital.current_status.toUpperCase()}
  </span>
</p>
<p><b>Reason :</b>{selectedHospital.reject_reason}</p>
    <div style={{ marginTop: "15px" }}>
      <button
        className={`${buttonStyles.btn} ${buttonStyles["btn-primary"]}`}
         disabled={selectedHospital.current_status === "approved"}
        onClick={() => handleVerify(selectedHospital.id)}
      >
        Approve
      </button>
    </div>
  </div>
  </div>
)}






      <div className={cardStyles.mobileCards}>
          {filteredHospitals.map((hospital) => (
              <div key={hospital.id} className={cardStyles.requestcard}>
                <p>👤 {hospital.hs_name}</p>
                <p>📞 {hospital.mobile_number}</p>
                <p>🩸 {hospital.registration_number}</p>
                <p>📍 {hospital.address}</p>
                <p>✅ <b>Verified By : </b>{hospital.verified_by ? hospital.verified_by: "--"}</p>
                
                <p>⏰ <b>Verified At : </b>{hospital.verified_at ? new Date(hospital.verified_at).toLocaleString() : "—"}</p>
               <button className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                  onClick={() => setSelectedHospital(hospital)}>
                    Manage
                  </button>
              </div>
            ))}
      </div>
    </div>
  );




};

export default RejectedHospitals;