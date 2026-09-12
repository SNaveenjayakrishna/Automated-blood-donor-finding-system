import React, { useState } from "react";
import MobileVerification from "./MobileVerification";
import DonorSignup from "../Signup/DonorSignup";
import HospitalSignup from "../HospitalSignup/HospitalSignup";

const Signup = () => {
  const [mobile, setMobile] = useState("");
  const [userType, setUserType] = useState("");
  const handleMobileVerified = (verifiedMobile, user_type) => {
    setMobile(verifiedMobile);
    setUserType(user_type);
  };
  return (
    <>
      {!userType && (
        <MobileVerification
          onVerified={handleMobileVerified}
          otp_purpose="signup"
        />
      )}

      {userType === "Donor" && <DonorSignup mobile={mobile} />}

      {userType === "Hospital" && <HospitalSignup mobile={mobile} />}
    </>
  );
};
export default Signup;
