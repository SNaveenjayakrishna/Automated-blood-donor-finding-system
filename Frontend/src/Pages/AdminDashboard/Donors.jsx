import { useState, useEffect} from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import tableStyles from "../../styles/tables.module.css";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import modalStyles from "../../styles/modal.module.css";

import DonationHistory from "./DonationHistory";
const Donors = () => {

    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDonors, setFilteredDonors] = useState([]);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [blockReason, setBlockReason] = useState("");
    const [showBlock, setShowBlock] = useState(false);



    const fetchDonors = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/admin/donors`, { method: "GET", credentials: "include" });
        const data = await res.json();
        if (res.ok) setDonors(data.donors);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
 useEffect(() => {

    fetchDonors();
  }, []);


  useEffect(() => {
      const filtered = donors.filter(donor =>
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.mobile_number.includes(searchQuery) ||
        String(donor.weight || "").includes(searchQuery)||
        donor.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (donor.last_donation_date || "").includes(searchQuery) ||
        (donor.date_of_birth || "").includes(searchQuery) ||
        donor.blood_group.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.availability.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDonors(filtered);
    }, [searchQuery, donors]);


  const handleBlock = async (id) => {

    if (!blockReason.trim()) {
    alert("Block reason is required");
    return;
  }

  try{
  const response = await fetch(`${BACKEND_URL}/admin/block_donor/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reason: blockReason })
  });
 const data = await response.json();

    if (response.ok) {
      alert(data.message);
      await fetchDonors();
      setSelectedDonor(null);
      setShowBlock(false);
      setBlockReason("");
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.error("Error:", error);
    alert(error);
  }
};



  if (loading) return <p className={cardStyles.card}>Loading Donors...</p>;
  if (!donors.length) return <p className={cardStyles.card}>No donors have been registered...</p>;

 return (
    <div className={cardStyles.card}>
      <h3>Donors</h3>
      <input
        type="text"
        placeholder="Search by donor name, address or mobile..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={inputStyles.searchInput}
      />
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Blood Group</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map((donor, index)=>(
              <tr key={donor.id}>
                <td>{index+1}</td>
                <td>{donor.name}</td>
                <td>{donor.mobile_number}</td>
                <td>{donor.blood_group}</td>
                <td>
                  <button className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                  onClick={() => setSelectedDonor(donor)}>
                    Manage
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDonor && (
   <div className={modalStyles.overlay} onClick={() => setSelectedDonor(null)}>
  <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}> {/*e.stopPropagation() -when we click the modal it stops the click event from moving to the parent(overlay).*/}
    
       <button
        className={modalStyles.closeBtn}
        onClick={() => {
          setSelectedDonor(null);
          setShowBlock(false);
          setBlockReason("");
        }}
      >
        ✕
      </button>
    <h3>Donor Details</h3>

    <p><b>Name:</b> {selectedDonor.name}</p>
    <p><b>Mobile:</b> {selectedDonor.mobile_number}</p>
    <p><b>Blood Group:</b> {selectedDonor.blood_group}</p>
    <p><b>Address:</b> {selectedDonor.address}</p>
   <p><b>Weight:</b> {selectedDonor.weight}</p>
   <p><b>DOB:</b> {selectedDonor.date_of_birth}</p>
   <p><b>Availability:</b> {selectedDonor.availability}</p>
   <p><b>Last Donation:</b> {selectedDonor.last_donation_date}</p>

    <h3>Donation History</h3>

    <DonationHistory id = {selectedDonor.user_id}/>
  <div style={{ marginTop: "15px" }}>

      <button
        className={`${buttonStyles.btn} ${buttonStyles["btn-warning"]}`}
        disabled={selectedDonor.verification_status === "blocked"}
        style={{ marginLeft: "10px" }}
        onClick={() => setShowBlock(!showBlock)}
      >
        Block Donor
      </button>


      {showBlock && (
      <div style={{ marginTop: "15px" }}>
      <input
      type="text"
      placeholder="Enter reason for blocking"
      value={blockReason}
      onChange={(e) => setBlockReason(e.target.value)}
      className={inputStyles.searchInput}
      
    />
    <button
      className={`${buttonStyles.btn} ${buttonStyles["btn-danger"]}`}
      style={{ marginLeft: "10px" }}
      onClick={() => handleBlock(selectedDonor.user_id)}
    >
      Confirm Block
    </button>
  </div>
)}
    </div>
 
  </div>
  </div>
)}



      <div className={cardStyles.mobileCards}>
          {filteredDonors.map((donor) => (
              <div key={donor.id} className={cardStyles.requestcard}>
                <p>👤 {donor.name}</p>
                <p>📞 {donor.mobile_number}</p>
                <p>🩸 {donor.blood_group}</p>
               <button className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                  onClick={() => setSelectedDonor(donor)}>
                    Manage
                  </button>
              </div>
            ))}
      </div>
    </div>
  );




};

export default Donors;