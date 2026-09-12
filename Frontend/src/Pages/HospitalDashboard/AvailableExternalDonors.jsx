import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import { handleDownload } from "../Certificate/certificate";
import tableStyles from "../../styles/tables.module.css";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import modalStyles from "../../styles/modal.module.css";

const Available_External_Donors = ({ id }) => {
  const [donors, setDonors] = useState([]);
  // const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [searchQuery, setSearchQuery] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null);

  const [donationDate, setDonationDate] = useState("");

  const fetchDonors = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/available_external_donors/${id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (res.ok) {
        setDonors(data.availabledonors || []);
        // setFilteredDonors(data.availabledonors || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [id]);

  const updateDonation = async (
    user_id,
    request_id,
    hs_id,
    hs_name,
    donationDate,
    donor_type,
  ) => {
    console.log(hs_id);
    try {
      const res = await fetch(`${BACKEND_URL}/updateDonation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_id,
          request_id,
          hs_id,
          hs_name,
          donationDate,
          donor_type,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Certificate Generated");

        await fetchDonors(); // 🔥 REFRESH FROM DATABASE

        setSelectedDonor(null); // optional: close modal
        setDonationDate(""); // reset input
      } else {
        alert("Failed to generate certificate");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  if (loading) return <p className={cardStyles.card}>Loading donors...</p>;

  if (!donors.length)
    return <p className={cardStyles.card}>No donors have responded yet.</p>;

  return (
    <div>
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Blood Group</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {donors.map((donor, index) => (
              <tr key={donor.id}>
                <td>{index + 1}</td>
                <td>{donor.name}</td>
                <td>{donor.mobile_number}</td>
                <td>{donor.blood_group}</td>

                <td>
                  <button
                    className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                    onClick={() => setSelectedDonor(donor)}
                  >
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
          <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={modalStyles.closeBtn}
              onClick={() => setSelectedDonor(null)}
            >
              ✕
            </button>

            <h3>External Donor Details</h3>

            <p>
              <b>Name:</b> {selectedDonor.name}
            </p>
            <p>
              <b>Mobile:</b> {selectedDonor.mobile_number}
            </p>
            <p>
              <b>Blood Group:</b> {selectedDonor.blood_group}
            </p>
            <p>
              <b>Address:</b> {selectedDonor.location}
            </p>

            <p>
              <b>Responded at:</b>{" "}
              {selectedDonor.responded_at ? selectedDonor.responded_at : "—"}
            </p>
            <div style={{ marginTop: "15px" }}>
              {!selectedDonor.is_certificate_issued && (
                <div>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Donation Date
                  </label>

                  <input
                    type="date"
                    className={inputStyles.input}
                    value={donationDate}
                    onChange={(e) => setDonationDate(e.target.value)}
                    style={{ marginBottom: "10px" }}
                  />
                </div>
              )}

              {/* Confirm Donation Button */}
              <button
                className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                disabled={selectedDonor.is_certificate_issued || !donationDate}
                onClick={() =>
                  updateDonation(
                    selectedDonor.donor_id,
                    selectedDonor.request_id,
                    selectedDonor.hs_id,
                    selectedDonor.hs_name,
                    donationDate,
                    selectedDonor.donor_type,
                  )
                }

                
              >
                {selectedDonor.is_certificate_issued
                  ? "Donated"
                  : "Confirm Donation"}
              </button>

              {/* Download Certificate Button */}
              <button
                className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                disabled={!selectedDonor.is_certificate_issued} // ✅ IMPORTANT
                onClick={() =>
                  handleDownload(
                    selectedDonor.donor_id,
                    selectedDonor.name,
                    selectedDonor.donation_id,
                  )
                }
              >
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={cardStyles.mobileCards}>
        {donors.map((donor, index) => (
          <div key={donor.id} className={cardStyles.requestcard}>
            <p>
              <b>S.No.</b> {index + 1}
            </p>
            <p>👤 {donor.name}</p>
            <p>📞 {donor.mobile_number}</p>
            <p>🩸 {donor.blood_group}</p>

            <p>
              <button
                className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                onClick={() => setSelectedDonor(donor)}
              >
                Manage
              </button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Available_External_Donors;
