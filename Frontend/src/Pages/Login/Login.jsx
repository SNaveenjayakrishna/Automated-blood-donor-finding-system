import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import style from "../../styles/forms.module.css";
import messageStyles from "../../styles/messages.module.css";
import { validateMobile } from "../utils/validateMobile";
import { BACKEND_URL } from "../../config/apiConfig";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userType, setUserType] = useState("Donor");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mobileCheck = validateMobile(mobile);
    if (mobileCheck !== "valid") {
      setMessage(mobileCheck);
      return;
    }
    if (!mobile || !password || !userType) {
      setMessage("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ MUST
        body: JSON.stringify({ mobile, password, userType }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role == "donor") {
          navigate("/donor/dashboard");
        } else if (data.role == "admin") {
          navigate("/admin/dashboard");
        } else if (data.role == "hospital") {
          navigate("/hospital/dashboard");
        }
      } else {
        setMessage(data.message || "Signin failed");
      }
    } catch (err) {
      setMessage("Error during signin");
    }
  };

  return (
    <div className={style.loginBody}>
      <div className={style.loginContainer}>
        <h2>Login</h2>

        {message && <p className={messageStyles.message}>{message}</p>}

        <form onSubmit={handleSubmit} className={style.loginform}>
          <input
            type="tel"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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
          {/* for="donor" tells the browser:This label belongs to the input whose id is donor. */}
          {/* React uses htmlFor instead of for:Because for is a reserved JavaScript keyword, so JSX uses the DOM property name htmlFor. */}
          {/* defaultChecked: selects the radio button by default, but allows the user to change the selection. */}
          {/* checked: keeps the radio button selected (controlled by React); use it when managing the value with state. */}
          <button type="submit">Login</button>

          <div className={style.loginfooter}>
            <Link to="/resetpassword">Forgot Password?</Link>
            <span className={style.separator}>|</span>
            <Link to="/signup">Signup</Link>
            {/* <span className={style.separator}>|</span>
            <Link to="/hospital/">Hospital User</Link> */}
          </div>
        </form>
      </div>
    </div>
  );
}
