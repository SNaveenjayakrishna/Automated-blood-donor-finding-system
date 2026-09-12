// components/Dashboard/Availability.jsx
import React, { useState } from "react";
import { BACKEND_URL } from "../../../config/apiConfig";
import buttonStyles from "../../../styles/buttons.module.css";
import cardStyles from "../../../styles/cards.module.css";
import statusStyles from "./availabilityStatus.module.css";

const Availability = ({ user, setUser }) => {
  const [available, setAvailable] = useState(user.availability === 1);

  const toggleAvailability = async () => {
    try {
      const newAvailability = !available;
      const res = await fetch(`${BACKEND_URL}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_id: user.id, availability: newAvailability }),
      });
      const data = await res.json();
      if (res.ok) {
        setAvailable(newAvailability);
        setUser(prev => ({ ...prev, availability: newAvailability ? 1 : 0 }));
      } else console.error(data.error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={cardStyles.card}>
      <p>
        <strong>Status:</strong>{" "}
        <span className={available ? statusStyles["status-available"] : statusStyles["status-unavailable"]}>
          {available ? "Available" : "Unavailable"}
        </span>
      </p>
      <button className={`${buttonStyles.btn} ${buttonStyles["btn-primary"]}`} onClick={toggleAvailability}>
        {available ? "Mark Unavailable" : "Mark Available"}
      </button>
    </div>
  );
};

export default Availability;
