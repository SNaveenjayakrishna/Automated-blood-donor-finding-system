import React, { useEffect, useState } from "react";
import { validateMobile } from "../utils/validateMobile";
import style from "../../styles/forms.module.css";
import messageStyles from "../../styles/messages.module.css";
import { BACKEND_URL } from "../../config/apiConfig";

const MobileVerification = ({ onVerified, otp_purpose }) => {
  const [mobile, setMobile] = useState("");
  const [userType, setUserType] = useState("Donor");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState();

  useEffect(() => {
    if (!isOtpSent) {
      return;
    }

    if (timeLeft <= 0) {
      setOtpExpired(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isOtpSent]);

  const sendOtp = async () => {
    setMessage("");
    setOtp("");
    const mobileCheck = validateMobile(mobile);
    if (mobileCheck !== "valid") {
      setMessage(mobileCheck);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/generate_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobile,
          type: otp_purpose,
          user_type: userType,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "OTP sent successfully");
        setTimeout(() => {
          setMessage("");
        }, 2000);
        setTimeLeft(60);
        setOtpExpired(false);
        setIsOtpSent(true);
      } else {
        setMessage(data.message || "OTP sent successfully");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    if (otpExpired) {
      setMessage("OTP expired. Please request a new OTP.");
      return;
    }

    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/verify_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobile,
          type: otp_purpose,
          otp: otp,
          user_type: userType.toLowerCase(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("OTP verified successfully");
        onVerified(mobile, userType);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Error verifying OTP");
    }
  };

  return (
    <div className={style.loginBody}>
      <div className={style.loginContainer}>
        <form className={`${style.loginform}`}>
          {/* <form className={`${style.loginform} ${style_2.signupform}`}>*/}
          <h2>Verify Mobile Number</h2>
          {/* {message && <p style={{ color: "red" }}>{message}</p>} */}
          {message && <p className={messageStyles.message}>{message}</p>}
          {isOtpSent && (
            <p>
              {timeLeft > 0
                ? `OTP expires in ${timeLeft} seconds`
                : "OTP Expired"}
            </p>
          )}
          <div className={style.userType}>
            <input
              type="radio"
              id="donor"
              name="userType"
              value="Donor"
              checked={userType === "Donor"}
              onChange={(e) => setUserType(e.target.value)}
            />
            <label htmlFor="donor">Donor</label>
            <input
              type="radio"
              id="hospital"
              name="userType"
              value="Hospital"
              checked={userType === "Hospital"}
              onChange={(e) => setUserType(e.target.value)}
            />
            <label htmlFor="hospital">Hospital</label>
          </div>
          <input
            id="mobile"
            placeholder="Mobile Number"
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={sendOtp}
            disabled={isOtpSent && !otpExpired}
          >
            {/* {isOtpSent && !otpExpired ? "Wait..." : "Send OTP"} */}
            Send OTP
          </button>

          <input
            placeholder="OTP"
            id="otp"
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="button" onClick={verifyOtp}>
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileVerification;
