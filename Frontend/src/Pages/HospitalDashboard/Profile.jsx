import React from "react";
import style from "../../styles/Profile.module.css";
import { FaGlobe, FaCompass, FaMapMarkerAlt, FaIdCard, FaPhoneAlt} from "react-icons/fa";
const Profile = ({ hospital }) => {
  {/*🆔 🌍 🧭 📍 📞*/ }
  return (
    <div className={style.Profile}>
        <div className={style.Header}>
          <div className={style.avatar}>{hospital.name?.charAt(0)}</div>
          <h2>{hospital.name}</h2>
        </div>
      <Section title="Personal Information">
      <Card label="Mobile" value={hospital.mobile} icon={<FaPhoneAlt color="#06B6D4"/>} />
      <Card label="registrationNumber" value={hospital.registrationNumber} icon={<FaIdCard color="#3B82F6"/>}/>
      </Section>
       {/* LOCATION */}
      <Section title="Location Details">
      <Card label="Address" value={`${hospital.address}, ${hospital.city}, ${hospital.district}, ${hospital.state}, ${hospital.country} - ${hospital.pincode}`} icon={<FaMapMarkerAlt color="#EF4444"/>} />
      <Card label="Latitude" value={hospital.latitude} icon= {<FaCompass color="#F59E0B"/>} />
      <Card label="Longitude" value={hospital.longitude} icon={<FaGlobe color="#10B981"/>} />     

      </Section>
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

