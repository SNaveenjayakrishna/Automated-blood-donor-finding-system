import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config/apiConfig";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import messageStyles from "../../styles/messages.module.css";

const DeleteAccount = ({ user, userType }) => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This action is irreversible.")) return;

    if(userType === "Donor"){
        try {
      const res = await fetch(`${BACKEND_URL}/delete_user/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Account deleted successfully.");
        setTimeout(() => navigate("/"), 1500);
      } else setMessage(data.message || "Delete failed");
    } catch (err) {
      console.error(err);
      setMessage("Error deleting account.");
    }
    }
    else if(userType === "Hospital"){
        try {
      const res = await fetch(`${BACKEND_URL}/delete_hospital/${user.id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        setMessage("Account deleted successfully.");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.message || "Failed to delete account.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error deleting account.");
    }
    }
    
  };

  return (
    <div className={cardStyles.dangerCard}>
      <h3>Delete Account</h3>
      {message && <p className={messageStyles.message}>{message}</p>}
      <p className={messageStyles.warningText}><span>Warning:</span> This action is irreversible. Your account and all data will be permanently deleted.</p>
      <button className={`${buttonStyles.btn} ${buttonStyles["btn-danger"]}`} onClick={handleDelete}>
        Delete My Account
      </button>
    </div>
  );
};

export default DeleteAccount;

