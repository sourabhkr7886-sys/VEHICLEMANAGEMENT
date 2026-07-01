import React from "react";
import { Link } from "react-router-dom";
import bgImage from "./assets/piter.png";
import "./navbar.css";

function Navbar() {
  return (
    <nav
      className="navbar"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.75), rgba(0,0,0,.75)), url(${bgImage})`,
      }}
    >
     
      <div className="nav-left">
        <h2 className="logo">Smart Vehicle Management</h2>
      </div>

      <div className="nav-right">
        <Link to="/login" className="btn login-button">Login</Link>
        <Link to="/register" className="btn button-primary">
           Register
         </Link>
      </div>
    </nav>
  );
}

export default Navbar;