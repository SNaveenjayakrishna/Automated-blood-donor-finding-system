import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import tableStyles from "../../styles/tables.module.css";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import modalStyles from "../../styles/modal.module.css";

const ExternalDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedDonor, setEditedDonor] = useState({});

  const fetchDonors = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/external_donors`, {
        method: "GET",
        credentials: "include",
      });
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
    const filtered = donors.filter(
      (donor) =>
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.mobile_number.includes(searchQuery) ||
        donor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (donor.last_donation || "").includes(searchQuery) ||
        donor.blood_group.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredDonors(filtered);
  }, [searchQuery, donors]);

  const handleChange = (e) => {
    setEditedDonor({
      ...editedDonor,
      [e.target.name]: e.target.value,
    });
  };

  const updateDonor = async () => {
    if (!editedDonor.name) {
      alert("Name cannot be empty");
      return;
    }
    if (!editedDonor.mobile_number) {
      alert("Mobile NUmber cannot be empty");
      return;
    }
    if (!editedDonor.blood_group) {
      alert("Please select a blood group");
      return;
    }
    if (!editedDonor.location) {
      alert("Address cannot be empty");
      return;
    }
    try {
      const res = await fetch(
        `${BACKEND_URL}/admin/update_external_donor/${editedDonor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editedDonor),
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert("Donor updated successfully");
        fetchDonors();
        setSelectedDonor(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className={cardStyles.card}>Loading Donors...</p>;
  if (!donors.length)
    return <p className={cardStyles.card}>No donors have been registered...</p>;

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
            {filteredDonors.map((donor, index) => (
              <tr key={donor.id}>
                <td>{index + 1}</td>
                <td>{donor.name}</td>
                <td>{donor.mobile_number}</td>
                <td>{donor.blood_group}</td>
                <td>
                  <button
                    className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
                    onClick={() => {
                      setSelectedDonor(donor);
                      setEditedDonor(donor);
                      setIsEditing(false);
                    }}
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
        <div className={`${modalStyles.overlay}`} onClick={() => setSelectedDonor(null)}>
          <div className={`${modalStyles.modal}`} onClick={(e) => e.stopPropagation()}>
            {/*e.stopPropagation() -when we click the modal it stops the click event from moving to the parent(overlay).*/}
            <button
              className={modalStyles.closeBtn}
              onClick={() => {
                setSelectedDonor(null);
                setIsEditing(false);
              }}
            >
              ✕
            </button>
            <h3>Donor Details</h3>
            <p>
              <b>Name:</b>{" "}
              {isEditing ? (
                <input
                  name="name"
                  value={editedDonor.name}
                  className={inputStyles.input}
                  onChange={handleChange}
                 
                />
              ) : (
                selectedDonor.name
              )}
            </p>
            <p>
              <b>Mobile:</b>{" "}
              {isEditing ? (
                <input
                  name="mobile_number"
                  className={inputStyles.input}
                  value={editedDonor.mobile_number}
                  onChange={handleChange}
                  
                />
              ) : (
                selectedDonor.mobile_number
              )}
            </p>
            <p>
              <b>Blood Group:</b>{" "}
              {isEditing ? (
                <select
                  name="blood_group"
                  className={inputStyles.input}
                  value={editedDonor.blood_group}
                  onChange={handleChange}
                  
                >
                  <option value="">Select Blood Group</option>
                  <option value="A1+">A1+</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                selectedDonor.blood_group
              )}
            </p>
            <p>
              <b>Address:</b>{" "}
              {isEditing ? (
                <input
                  name="location"
                  className={inputStyles.input}
                  value={editedDonor.location}
                  onChange={handleChange}
                  
                />
              ) : (
                selectedDonor.location
              )}
            </p>
            <p>
              <b>Last Donation:</b>{" "}
              {isEditing ? (
                <input
                  type="date"
                  name="last_donation_date"
                  className={inputStyles.dateInput}
                  value={editedDonor.last_donation_date || ""}
                  onChange={handleChange}
                />
              ) : (
                selectedDonor.last_donation_date
              )}
            </p>
            <div style={{ marginTop: "15px" }}>
              {!isEditing ? (
                <button
                  className={`${buttonStyles.btn} ${buttonStyles["btn-primary"]}`}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              ) : (
                <button
                  className={`${buttonStyles.btn} ${buttonStyles["btn-primary"]}`}
                  onClick={updateDonor}
                >
                  Save
                </button>
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
            <button
              className={`${buttonStyles.btn} ${buttonStyles["btn-secondary"]}`}
              onClick={() => {
                setSelectedDonor(donor);
                setEditedDonor(donor);
                setIsEditing(false);
              }}
            >
              Manage
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExternalDonors;
