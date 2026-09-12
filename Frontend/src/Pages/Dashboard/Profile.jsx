import React from "react";
import style from "../../styles/Profile.module.css";

const Profile = ({ user }) => {
  return (
    <div>
      
      {/* Top Section */}
      
  <div className={style.Profile}>

  {/* HEADER */}
  <div className={style.Header}>
    <div className={style.avatar}>{user.name?.charAt(0)}</div>
    <h2>{user.name}</h2>

    <div className={style.badgesRow}>
      <span className={style.bloodBadge}>{user.blood_group}</span>
      <span className={user.availability ? style.availableBadge : style.unavailableBadge}>
        {user.availability ? "Available" : "Unavailable"}
      </span>
    </div>
  </div>

  {/* PERSONAL */}
  <Section title="Personal Information">
    <Card label="Mobile" value={user.mobile} icon="📞" />
    <Card label="Date of Birth"  value={user.dob ? new Date(user.dob).toLocaleDateString() : ""}  icon="🎂" />
    <Card label="Weight" value={`${user.weight} kg`} icon="⚖️" />
  </Section>

  {/* LOCATION */}
  <Section title="Location Details">
    <Card label="Address" value={`${user.address}, ${user.city}, ${user.district}, ${user.state}, ${user.country} - ${user.pincode}`} icon="📍" />
    <Card label="Latitude" value={user.latitude} icon="🧭" />
    <Card label="Longitude" value={user.longitude} icon="🌍" />
  </Section>

  {/* DONATION */}
  <Section title="Donation Info">
    <Card label="Last Donation" value={user.last_donation_date || "N/A"} icon="🩸" />
  </Section>

</div>

    </div>
  );
};

const Section = ({ title, children }) => (
  <div className={style.section}>
    <h4>{title}</h4>
    {children}
  </div>
);

const Card = ({ label, value, icon }) => (
  <div className={style.mobileCard}>
    <div className={style.cardIcon}>{icon}</div>
    <div>
      <span className={style.cardLabel}>{label}</span>
      <div className={style.cardValue}>{value}</div>
    </div>
  </div>
);

export default Profile;

