import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [page, setPage] = useState("login");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "driver",
  });

  const [forgotEmail, setForgotEmail] = useState("");

  const [resetForm, setResetForm] = useState({
    email: "",
    token: "",
    new_password: "",
  });


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", loginForm);

      const userId = res.data.user_id;

      if (!userId) {
        throw new Error("user_id not received from backend");
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user_id", userId);

      navigate(
        res.data.role === "admin"
          ? "/admin-dashboard"
          : res.data.role === "manager"
          ? "/manager-dashboard"
          : "/Dashboard"
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || err.message);
    }
  };

  
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/forgot-password", {
        email: forgotEmail,
      });

      alert(
        res.data.message || "Reset token sent successfully"
      );

      setResetForm((prev) => ({
        ...prev,
        email: forgotEmail,
      }));

      setPage("reset");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Failed to send reset token"
      );
    }
  };

 
  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/reset-password", {
        email: resetForm.email,
        token: resetForm.token,
        new_password: resetForm.new_password,
      });

      alert(
        res.data.message ||
          "Password reset successfully"
      );

      setResetForm({
        email: "",
        token: "",
        new_password: "",
      });

      setForgotEmail("");

      setPage("login");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Failed to reset password"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        
        <button
          className="close-btn"
          onClick={() => navigate("/")}
        >
          ✕
        </button>

        
        {page === "login" && (
          <>
            <h2 className="login-title">
              LOGIN ACCOUNT
            </h2>

            <form
              className="login-form"
              onSubmit={handleLogin}
            >
              <select
                className="login-input"
                value={loginForm.role}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    role: e.target.value,
                  })
                }
              >
                <option value="admin">
                  Admin
                </option>
                <option value="manager">
                  Manager
                </option>
                <option value="driver">
                  Driver
                </option>
              </select>

              <input
                className="login-input"
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    email: e.target.value,
                  })
                }
                required
              />

              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    password: e.target.value,
                  })
                }
                required
              />

              <button
                className="login-btn"
                type="submit"
              >
                Login
              </button>

              <p
                className="forgot-password"
                onClick={() =>
                  setPage("forgot")
                }
              >
                Forgot Password?
              </p>
            </form>
          </>
        )}

        {/* {/ FORGOT PASSWORD  */}
        {page === "forgot" && (
          <>
            <h2 className="login-title">
              Forgot Password
            </h2>

            <form
              className="login-form"
              onSubmit={handleForgotPassword}
            >
              <input
                className="login-input"
                type="email"
                placeholder="Enter Email"
                value={forgotEmail}
                onChange={(e) =>
                  setForgotEmail(
                    e.target.value
                  )
                }
                required
              />

              <button
                className="login-btn"
                type="submit"
              >
                Send Reset Token
              </button>

              <p
                className="forgot-password"
                onClick={() =>
                  setPage("login")
                }
              >
                Back to Login
              </p>
            </form>
          </>
        )}

        {/* RESET PASSWORD  */}
        {page === "reset" && (
          <>
            <h2 className="login-title">
              Reset Password
            </h2>

            <form
              className="login-form"
              onSubmit={handleResetPassword}
            >
              <input
                className="login-input"
                type="email"
                placeholder="Email"
                value={resetForm.email}
                onChange={(e) =>
                  setResetForm({
                    ...resetForm,
                    email: e.target.value,
                  })
                }
                required
              />

              <input
                className="login-input"
                type="text"
                placeholder="Reset Token"
                value={resetForm.token}
                onChange={(e) =>
                  setResetForm({
                    ...resetForm,
                    token: e.target.value,
                  })
                }
                required
              />

              <input
                className="login-input"
                type="password"
                placeholder="New Password"
                value={resetForm.new_password}
                onChange={(e) =>
                  setResetForm({
                    ...resetForm,
                    new_password:
                      e.target.value,
                  })
                }
                required
              />

              <button
                className="login-btn"
                type="submit"
              >
                Reset Password
              </button>

              <p
                className="forgot-password"
                onClick={() =>
                  setPage("login")
                }
              >
                Back to Login
              </p>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

export default Login;