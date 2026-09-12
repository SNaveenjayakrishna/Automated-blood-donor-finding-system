// components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config/apiConfig";
import style from "../../styles/dashboard.module.css";
import messageStyles from "../../styles/messages.module.css";

import {
  FaUser,
  FaUserEdit,
  FaCheckCircle,
  FaBell,
  FaHandHoldingHeart,
  FaHistory,
  FaMapMarkerAlt,
  FaTrashAlt,
  FaSignOutAlt,
  FaTimes,
  FaBars,
} from "react-icons/fa";

import Profile from "./Profile";
import EditProfile from "./EditProfile";
import Availability from "./Availability/Availability";
import LastDonation from "./LastDonation";
import MyDonations from "./MyDonations";
import Requests from "./Requests";
import DeleteAccount from "../Components/DeleteAccount";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("profile");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/dashboard`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !data.user) navigate("/");
        else setUser(data.user);
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return <p className={messageStyles.loading}>Loading...</p>;
  if (!user) return null;

  const handleMenuClick = (page) => {
    setActivePage(page);
    setSidebarVisible(false); // 👈 hide sidebar after click
  };

  return (
    <div className={style.dashboardContainer}>
      {/* Sidebar toggle */}
      {!sidebarVisible && (
        <button
          className={style.sidebarToggleBtn}
          onClick={() => setSidebarVisible(true)}
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`${style.sidebar} ${sidebarVisible ? style.show : ""}`}>
        {sidebarVisible && (
          <button
            className={style.closeBtn}
            onClick={() => setSidebarVisible(false)}
          >
            <FaTimes />
          </button>
        )}

        <h2 className={style.heading}>Donor Panel</h2>
        <button
          className={activePage === "profile" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("profile")}
        >
          <FaUser className={style.menuIcon} /> Profile
        </button>

        <button
          className={activePage === "editprofile" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("editprofile")}
        >
          {" "}
          <FaUserEdit className={style.menuIcon} /> Edit Profile
        </button>

        <button
          className={activePage === "availability" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("availability")}
        >
          {" "}
          <FaCheckCircle className={style.menuIcon} /> Availability
        </button>

        <button
          className={activePage === "requests" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("requests")}
        >
          <FaBell className={style.menuIcon} /> Requests
        </button>

        <button
          className={activePage === "mydonations" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("mydonations")}
        >
          <FaHandHoldingHeart className={style.menuIcon} /> My Donations
        </button>

        <button
          className={activePage === "lastDonation" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("lastDonation")}
        >
          {" "}
          <FaHistory className={style.menuIcon} /> Last Donation
        </button>

        <button
          className={activePage === "deleteAccount" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("deleteAccount")}
        >
          <FaTrashAlt className={style.menuIcon} /> Delete Account
        </button>

        <button className={style.logoutBtn} onClick={handleLogout}>
          <FaSignOutAlt className={style.menuIcon} /> Logout
        </button>
      </aside>

      {sidebarVisible && (
        <div
          className={style.overlay}
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Main Content */}
      <main className={style.mainContent}>
        {activePage === "profile" && <Profile user={user} />}
        {activePage === "editprofile" && (
          <EditProfile user={user} setUser={setUser} />
        )}
        {activePage === "availability" && (
          <Availability user={user} setUser={setUser} />
        )}
        {activePage === "requests" && <Requests />}
        {activePage === "mydonations" && <MyDonations user={user} />}
        {activePage === "lastDonation" && (
          <LastDonation user={user} setUser={setUser} />
        )}

        {activePage === "deleteAccount" && <DeleteAccount user={user} userType = "Donor"/>}
      </main>
    </div>
  );
};

export default Dashboard;
