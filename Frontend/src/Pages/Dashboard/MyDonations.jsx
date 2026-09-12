// components/Dashboard/MyDonations.jsx
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import tableStyles from "../../styles/tables.module.css";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import { handleDownload } from "../Certificate/certificate";
import messageStyles from "../../styles/messages.module.css";

const MyDonations = ({ user }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
      const [filteredDonations, setFilteredDonations] = useState([]);

  const fetchMyDonations = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/mydonations?user_id=${user.id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setDonations(data.mydonations || []);
      else console.error(data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, [user.id]);

  useEffect(() => {
    const filtered = donations.filter(d =>
      d.hospital_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospital_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospital_mobile.includes(searchQuery) ||
       d.donation_date.includes(searchQuery)
    );
    setFilteredDonations(filtered);
  }, [searchQuery, donations]);

  
  if (loading) return <p className={messageStyles.loading}>Loading donations...</p>;
  if (!donations.length) return <p>No donations yet.</p>;

  return (
    <div className={cardStyles.card}>
      <h3>My Donations</h3>
      {/* Search Bar */}
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
              <th>Donation Date</th>
              <th>Hospital Address</th>
              <th>Hospital Mobile</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map((donation, index) =>(
              <tr key={donation.id}>
                <td>{index+1}</td>
                <td>{donation.hospital_name}</td>
                <td>{donation.donation_date}</td>
                <td>{donation.hospital_address}</td>
                <td>{donation.hospital_mobile}</td>
                <td>
                  <button className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`} onClick={() => handleDownload(user.id, user.name, donation.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))
            
            }
          
       
            {/* Add more rows explicitly if needed */}
          </tbody>
        </table>
      </div>
      <div className={cardStyles.mobileCards}>
        {filteredDonations.map((donation, i) => (
          <div key={i} className={cardStyles.requestcard}>
            <p><b>S.NO</b> {i+1}</p>
            <p>🏥 {donation.hospital_name}</p>
            <p>🕒 {donation.donation_date}</p>
            <p>📍 {donation.hospital_address}</p>
            <p>📞 {donation.hospital_mobile}</p>
            <button className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`} onClick={() => handleDownload(user, donation)}>
              Download Certificate
            </button>
          </div>
          ))}
      </div>
    </div>
  );
};

export default MyDonations;
