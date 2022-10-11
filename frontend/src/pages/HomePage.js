import React, { useContext } from "react";
import image from "../img/power.gif";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const HomePage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (user.id) {
    navigate("/userAppointments");
  } else {
    return (
      <div className="home-page">
        <img className="home-logo" src={image} alt="logo"></img>
        <Link style={{ textDecoration: "none" }} to="/login">
          <h4 className="home-book">Book Appointment</h4>
        </Link>
      </div>
    );
  }
};

export default HomePage;
