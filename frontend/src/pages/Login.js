import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const { login, error, isLoading } = useLogin();

  const [user, setUser] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "remember") {
      value = !login.remember;
    }
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    login({ email: user.email, password: user.password });

    setUser({
      email: "",
      password: "",
      remember: false,
    });
  };
  return (
    <div>
      <div>
        <div className="form">
          <div className="form-body">
            <div className="email">
              <label className="form__label" htmlFor="email">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                id="email"
                className="form__input"
                placeholder="Email"
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
                name="password"
                value={user.password}
                id="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="checkbox" htmlFor="remember">
              Remember me!
            </label>
            <input
              type="checkbox"
              id="remember"
              onChange={handleChange}
              name="remember"
            />
            <p className="login">
              Don't have an account? Register <a href="/register">Here</a>
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
              Sign In
            </Button>
          </div>
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Login;
