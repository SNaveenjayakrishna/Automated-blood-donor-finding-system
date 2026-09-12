import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config/apiConfig";
import style from "../../styles/dashboard.module.css";
import messageStyles from "../../styles/messages.module.css";

import {
  FaUser,
  FaUserEdit,
  FaHandHoldingMedical,
  FaChartBar,
  FaTrashAlt,
  FaSignOutAlt,
  FaUsers,
  FaTint,
  FaBars,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

import Profile from "./Profile";
import EditProfile from "./EditProfile";
import DeleteAccount from "../Components/DeleteAccount";
import RequestBlood from "./RequestBlood";
import RequestHistory from "./RequestHistory";
import UploadExternalDonors from "./UploadExternalDonors";
import DonorSummary from "../AdminDashboard/DonorSummary";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [activePage, setActivePage] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  /* ---------------- Fetch hospital session ---------------- */
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/hospital_dashboard`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok || data.role !== "hospital") {
          navigate("/");
          return;
        }
        setHospital(data.hospital);
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchHospital();
  }, [navigate]);

  /* ---------------- Logout ---------------- */
  const logout = async () => {
    await fetch(`${BACKEND_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  };

  if (loading) return <p className={messageStyles.loading}>Loading...</p>;
  if (!hospital) return null;

  const handleMenuClick = (page) => {
    setActivePage(page);
    setSidebarVisible(false); // 👈 hide sidebar after click
  };

  return (
    <div className={style.dashboardContainer}>
      {/* Toggle */}
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
        <h2 className={style.heading}>Hospital Panel</h2>

        {sidebarVisible && (
          <button
            className={style.closeBtn}
            onClick={() => setSidebarVisible(false)}
          >
            <FaTimes />
          </button>
        )}

        <button
          className={`${style.navBtn} ${activePage === "profile" ? style.activeBtn : ""}`}
          onClick={() => handleMenuClick("profile")}
        >
          <FaUser className={style.menuIcon} /> Profile
        </button>

        <button
          className={`${style.navBtn} ${activePage === "editprofile" ? style.activeBtn : ""}`}
          onClick={() => handleMenuClick("editprofile")}
        >
          <FaUserEdit className={style.menuIcon} /> Edit Profile
        </button>

        <button
          className={`${style.navBtn} ${activePage === "request" ? style.activeBtn : ""}`}
          onClick={() => handleMenuClick("request")}
        >
          <FaTint className={style.menuIcon} /> Request Blood
        </button>

        <button
          className={`${style.navBtn} ${activePage === "history" ? style.activeBtn : ""}`}
          onClick={() => handleMenuClick("history")}
        >
          <FaHandHoldingMedical className={style.menuIcon} /> Requests & Donors
        </button>

        <button
          className={`${style.navBtn} ${activePage === "donorSummary" ? style.activeBtn : ""}`}
          onClick={() => handleMenuClick("donorSummary")}
        >
          <FaChartBar className={style.menuIcon} /> Donor Summary
        </button>

        <button
          className={`${style.navBtn} ${activePage === "uploadExternalDonors" ? style.activeBtn : ""}`}
          onClick={() => handleMenuClick("uploadExternalDonors")}
        >
          <FaUpload className={style.menuIcon} /> Upload External Donors
        </button>

        <button
          className={`${style.navBtn} ${activePage === "deleteAccount" ? style.activeBtn : ""}`}
          onClick={() => handleMenuClick("deleteAccount")}
        >
          <FaTrashAlt className={style.menuIcon} /> Delete Account
        </button>

        <button
          className={`${style.navBtn} ${style.logoutBtn}`}
          onClick={logout}
        >
          <FaSignOutAlt className={style.menuIcon} /> Logout
        </button>
      </aside>

      {/* Overlay */}
      {sidebarVisible && (
        <div
          className={style.overlay}
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Main */}
      <main className={style.mainContent}>
        {activePage === "profile" && <Profile hospital={hospital} />}
        {activePage === "editprofile" && (
          <EditProfile hospital={hospital} setHospital={setHospital} />
        )}
        {activePage === "deleteAccount" && (
          <DeleteAccount user={hospital} userType="Hospital" />
        )}
        {activePage === "request" && <RequestBlood />}
        {activePage === "history" && <RequestHistory />}
        {activePage === "uploadExternalDonors" && <UploadExternalDonors />}
        {activePage === "donorSummary" && <DonorSummary />}
      </main>
    </div>
  );
};

export default HospitalDashboard;
