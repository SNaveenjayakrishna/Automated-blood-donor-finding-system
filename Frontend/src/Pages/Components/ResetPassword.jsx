import { useState } from "react";
import style from "../../styles/forms.module.css";
import messageStyles from "../../styles/messages.module.css"
import MobileVerification from "./MobileVerification";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../utils/validatePassword";
import { BACKEND_URL } from "../../config/apiConfig";
const ResetPassword = () =>{
    const [mobile, setMobile] = useState("");
    const [userType, setUserType] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const navigate = useNavigate();

    const handleMobileVerified = (verifiedMobile, user_type) => {
    setMobile(verifiedMobile);
    setUserType(user_type)

};
const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if(password != confirmPassword){
        setMessage("Password doesn't match")
    }
    const passwordCheck = validatePassword(password);
    if (passwordCheck !== "valid") {
      setMessage(passwordCheck);
    return;
  }

    try {
      const res = await fetch(`${BACKEND_URL}/reset_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: password, mobile: mobile, userType: userType }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/");
      } else{
        setMessage(data.error + " Password Reset Failed");
      } 
    } catch (err) {
      console.error(err);
    }
  };
    return (
    
    <>  
      {!userType && (
        <MobileVerification
          onVerified={handleMobileVerified} otp_purpose = "password_reset"
        />
      )}

       {userType && (
        <div className={style.loginBody}>
        <div className={style.loginContainer}>
        <form onSubmit={handleSubmit} className={style.loginform}>
            <h2>Reset Password</h2>
        {/* {message && <p style={{ color: "red" }}>{message}</p>} */}
        {message && <p className={messageStyles.message}>{message}</p>}
            <input
              placeholder="New Password"
              id="new_password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              placeholder="Confirm Password"
              id="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {/* Submit Button */}
            <button type="submit">Submit</button>
          </form>
          </div>
    </div>
       )}
      </>
    )
}

export default ResetPassword;