import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

const Register = () => {
  const { signup, isLoading, error } = useSignup();
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password1: "",
    password2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const userData = {
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      password: user.password1,
      userType: "cs",
      phone: user.phone,
    };

    await signup(userData);

    setUser({
      fname: "",
      lname: "",
      email: "",
      phone: "",
      password1: "",
      password2: "",
    });
  };

  return (
    <div>
      <div className="form">
        <div className="form-body">
          <div className="username">
            <label className="form__label" htmlFor="firstName">
              First Name:
            </label>
            <input
              className="form__input"
              type="text"
              name="fname"
              id="firstName"
              placeholder="First Name"
              value={user.fname}
              onChange={handleChange}
            />
          </div>
          <div className="lastname">
            <label className="form__label" htmlFor="lastName">
              Last Name:
            </label>
            <input
              type="text"
              name="lname"
              id="lastName"
              className="form__input"
              placeholder="Last Name"
              value={user.lname}
              onChange={handleChange}
            />
          </div>
          <div className="phone#">
            <label className="form__label" htmlFor="lastName">
              Phone number:
            </label>
            <input
              type="text"
              name="phone"
              id="phone#"
              className="form__input"
              placeholder="Phone #"
              value={user.phone}
              onChange={handleChange}
            />
          </div>
          <div className="email">
            <label className="form__label" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form__input"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <div className="password">
            <label className="form__label" htmlFor="password">
              Password:
            </label>
            <input
              className="form__input"
              type="password"
              name="password1"
              id="password"
              placeholder="Password"
              value={user.password1}
              onChange={handleChange}
            />
          </div>
          <div className="confirm-password">
            <label className="form__label" htmlFor="confirmPassword">
              Confirm Password:
            </label>
            <input
              className="form__input"
              name="password2"
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={user.password2}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <p className="login">
            Already have an account? Log In <Link to="/log-in">Here</Link>
          </p>
        </div>
        <div className="footer">
          <Button
            type="submit"
            className="btn"
            variant="outline-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Register
          </Button>
        </div>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
};

export default Register;
