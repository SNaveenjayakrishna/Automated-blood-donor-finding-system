import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import tableStyles from "../../styles/tables.module.css";
import cardStyles from "../../styles/cards.module.css";

import { FaHospital, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

const DonationHistory = ({id}) => {

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
   
    const fetchDonations = async () => {
          try {
            const res = await fetch(`${BACKEND_URL}/admin/donation_history/${id}`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (res.ok) setDonations(data.donations);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
     useEffect(() => {
        fetchDonations();
      }, [id]);

      if (loading) return <p className={cardStyles.card}>Loading Donation History...</p>;
      if (!donations.length) return <p className={cardStyles.card}>No Donations have done yet.</p>;
      return (
        <div>
            <div className={tableStyles.tableWrapper}>
                <table className={tableStyles.table}>
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Hospital Name</th>
                      <th>Hospital Address</th>
                      <th>Hospital Mobile Number</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation, index)=>(
                      <tr key={donation.id}>
                        <td>{index+1} . </td>
                        <td>{donation.hospital_name}</td>
                        <td>{donation.hospital_address}</td>
                        <td>{donation.hospital_mobile}</td>
                        <td>{new Date(donation.certificate_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
      <div className={cardStyles.mobileCards}>
        {donations.map((donation, index) => (
        <div key={donation.id} className={cardStyles.requestcard}>
      <p><b>S.No .</b> {index+1}</p>
      <p>
        <FaHospital /> {donation.hospital_name}
      </p>

      <p>
        <FaPhoneAlt /> {donation.hospital_mobile}
      </p>

      <p>
        <FaMapMarkerAlt /> {donation.hospital_address}
      </p>

      <p>
        <FaCalendarAlt /> {donation.certificate_date}
      </p>

    </div>
  ))}
</div>

              </div>
      )

}

export default DonationHistory;
