import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import messageStyles from "../../styles/messages.module.css";
import style from "../../styles/dashboard.module.css";
import { BACKEND_URL } from "../../config/apiConfig";

import {
  FaBars,
  FaUser,
  FaUserEdit,
  FaCheckCircle,
  FaHandHoldingHeart,
  FaHistory,
  FaMapMarkerAlt,
  FaTrashAlt,
  FaSignOutAlt,
  FaHospital,
  FaTimes,
  FaHourglassHalf,
  FaBan,
  FaLock,
  FaUserSlash,
  FaHeartbeat,
  FaTint,
  FaChartBar, FaBell, FaUpload
} from "react-icons/fa";



import Profile from "../Dashboard/Profile";
import EditProfile from "../Dashboard/EditProfile";
import Availability from "../Dashboard/Availability/Availability";
import LastDonation from "../Dashboard/LastDonation";
import MyDonations from "../Dashboard/MyDonations";

import DeleteAccount from "../Components/DeleteAccount";

import PendingHospitals from "./PendingHospitals";
import ApprovedHospitals from "./ApprovedHospitals";
import BlockedHospitals from "./BlockedHospitals";
import RejectedHospitals from "./RejectedHospitals";
import Donors from "./Donors";
import BlockedDonors from "./BlockedDonors";
import BloodRequests from "./BloodRequests";
import DonorSummary from "./DonorSummary";
import UploadExternalDonors from "../HospitalDashboard/UploadExternalDonors";
import ExternalDonors from "./ExternalDonors";
import Requests from "../Dashboard/Requests";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("profile");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  


  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/admin_dashboard`, {
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
      <aside
        className={`${style.sidebar} ${
          sidebarVisible ? style.show : ""
        }`}
      >

        {sidebarVisible && (
    <button
      className={style.closeBtn}
      onClick={() => setSidebarVisible(false)}
    >
      <FaTimes />
    </button>
  )}

        <h2 className={style.heading}>Admin Panel</h2>
        <button
          className={activePage === "profile" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("profile")}
        ><FaUser className={style.menuIcon} /> Profile</button>
        
        <button
          className={activePage === "editprofile" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("editprofile")}
        > <FaUserEdit className={style.menuIcon} /> Edit Profile</button>
        
        <button
          className={activePage === "availability" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("availability")}
        > <FaCheckCircle className={style.menuIcon} /> Availability</button>
        
    
        <button
        className={activePage === "requests" ? style.activeBtn : ""}
        onClick={() => handleMenuClick("requests")}
        ><FaBell className={style.menuIcon} /> Requests</button>

        <button
          className={activePage === "mydonations" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("mydonations")}
        ><FaHandHoldingHeart className={style.menuIcon} /> My Donations</button>
        
        <button
          className={activePage === "lastDonation" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("lastDonation")}
        > <FaHistory className={style.menuIcon} /> Last Donation</button>
        
       
         
         <button
          className={activePage === "pendingHospitals" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("pendingHospitals")}
        ><FaHourglassHalf  className={style.menuIcon} />Pending Hospitals</button>


        <button
          className={activePage === "approvedhospitals" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("approvedhospitals")}
        ><FaHospital className={style.menuIcon} />Approved Hospitals</button>


        <button
          className={activePage === "blockedHospitals" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("blockedHospitals")}
        ><FaBan  className={style.menuIcon}/>Blocked Hospitals</button>

        <button
          className={activePage === "rejectedHospitals" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("rejectedHospitals")}
        ><FaLock  className={style.menuIcon}/>Rejected Hospitals</button>

         <button
          className={activePage === "donors" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("donors")}
        ><FaHeartbeat   className={style.menuIcon}/>Donors</button>

        <button
          className={activePage === "blockedDonors" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("blockedDonors")}
        ><FaUserSlash  className={style.menuIcon}/>Blocked Donors</button>

        <button
          className={activePage === "bloodRequests" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("bloodRequests")}
        ><FaTint   className={style.menuIcon}/>Blood Requests</button>


        <button
          className={activePage === "donorSummary" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("donorSummary")}
        ><FaChartBar   className={style.menuIcon}/>Donor Summary</button>
        
        <button
          className={activePage === "uploadExternalDonors" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("uploadExternalDonors")}
        ><FaUpload   className={style.menuIcon}/>Upload External Donors</button>
        
        <button
          className={activePage === "externalDonors" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("externalDonors")}
        ><FaChartBar   className={style.menuIcon}/>External Donors</button>

        <button
          className={activePage === "deleteAccount" ? style.activeBtn : ""}
          onClick={() => handleMenuClick("deleteAccount")}
        ><FaTrashAlt className={style.menuIcon} /> Delete Account</button>

        <button className={style.logoutBtn} onClick={handleLogout}>
          <FaSignOutAlt className={style.menuIcon} /> Logout
        </button>
      </aside>

      {sidebarVisible && <div className={style.overlay} onClick={() => setSidebarVisible(false)} />}

      {/* Main Content */}
      <main className={style.mainContent}>
        {activePage === "profile" && <Profile user={user} />}
        {activePage === "editprofile" && <EditProfile user={user} setUser={setUser} />}
        {activePage === "availability" && <Availability user={user} setUser={setUser} />}
        {activePage === "requests" && <Requests />}
        {activePage === "mydonations" && <MyDonations user={user} />}
        {activePage === "lastDonation" && <LastDonation user={user} setUser={setUser} />}

        {activePage === "approvedhospitals" && <ApprovedHospitals/>}
        {activePage === "pendingHospitals" && <PendingHospitals/>}
        {activePage === "blockedHospitals" && <BlockedHospitals/>}
        {activePage === "rejectedHospitals" && <RejectedHospitals/>}
        {activePage === "donors" && <Donors/>}
        {activePage === "blockedDonors" && <BlockedDonors/>}
        {activePage === "bloodRequests" && <BloodRequests/>}
        {activePage === "uploadExternalDonors" && <UploadExternalDonors/>}
        {activePage === "externalDonors" && <ExternalDonors/>}
        {activePage === "donorSummary" && <DonorSummary/>}
        {activePage === "deleteAccount" && <DeleteAccount user={user} userType="Donor"/>}
      </main>
    </div>
  );
};

export default AdminDashboard;
