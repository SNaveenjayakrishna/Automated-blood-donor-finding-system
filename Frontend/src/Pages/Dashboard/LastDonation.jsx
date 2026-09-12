// components/Dashboard/LastDonation.jsx
import React, { useState } from "react";
import { BACKEND_URL } from "../../config/apiConfig";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";

const LastDonation = ({ user, setUser }) => {
  const [lastDonation, setLastDonation] = useState(user.last_donation_date ? new Date(user.last_donation_date).toISOString().split("T")[0]: "");

  const updateLastDonation = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/lastdonation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_id: user.id, last_donation_date: lastDonation }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(prev => ({ ...prev, last_donation_date: lastDonation }));
        alert("Last donation date updated!");
      } else console.error(data.error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={cardStyles.card}>
      <p><strong>Last Donation Date:</strong></p>
      <input type="date" max={new Date().toISOString().split("T")[0]} value={lastDonation} onChange={(e) => setLastDonation(e.target.value)} className={inputStyles.dateInput} />
      <button className={`${buttonStyles.btn} ${buttonStyles["btn-primary"]}`} onClick={updateLastDonation}>Update</button>
    </div>
  );
};

export default LastDonation;
