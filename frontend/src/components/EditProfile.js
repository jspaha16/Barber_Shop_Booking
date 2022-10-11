import React, { useState, useContext, useEffect} from "react";
import Button from "react-bootstrap/Button";
import { UserContext } from "../contexts/UserContext";

const EditProfile = () => {
  const { user } = useContext(UserContext);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [updatedUser, setUpdatedUsers] = useState({fname:'',lname:'',email:''});
  const [msg,setMsg] = useState('');
  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value;
    setUpdatedUsers((users) => ({ ...users, [name]: value }));
  };

  useEffect(() => {
    fetch(`/api/user/getUserByEmail/${user.email}`)
      .then((res) => {
        return res.json();
      })
      .then((json)=>{
        setUpdatedUsers(json.user);
      })
      .catch(err=>{
        console.log(`Error ${err}`);
      })
  },[])

  //#region UpdateUser
  const updateUser = (evt) => {
    evt.preventDefault();
    fetch(`/api/user/updateUser/${updatedUser._id}`,
          { method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser),
          })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((json)=>{
            setMsg(json.message);
          })
          .catch((err) => {
            console.log(`Error ${err}`);
          });
  }
  //#endregion

  return (
    <div>
      <form noValidate onSubmit={updateUser}>
        <div className="form">
          <div className="form-body">
            <div className="username">
              <label className="form__label" for="fname">
                First Name:
              </label>
              <input
                onChange={handleChange}
                className="form__input"
                type="text"
                name="fname"
                value={updatedUser.fname}
                id="fname"
                placeholder="First Name"
              />
            </div>
            <div className="lastname">
              <label className="form__label" for="lname">
                Last Name:
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="lname"
                id="lname"
                value={updatedUser.lname}
                className="form__input"
                placeholder="LastName"
              />
            </div>
            {/* <div className="phone#">
              <label className="form__label" for="lastName">
                Phone number:
              </label>
              <input
                type="text"
                name=""
                id="phone#"
                className="form__input"
                placeholder="Phone #"
              />
            </div> */}
            <div className="email">
              <label className="form__label" for="email">
                Email:
              </label>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                value={updatedUser.email}
                id="email"
                className="form__input"
                placeholder="Email"
              />
            </div>
            {/* <div className="password">
              <label className="form__label" for="password">
                Password:
              </label>
              <input
                className="form__input"
                type="password"
                id="password"
                placeholder="Password"
              />
            </div>
            <div className="confirm-password">
              <label className="form__label" for="confirmPassword">
                Confirm Password:
              </label>
              <input
                className="form__input"
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
              />
            </div> */}
          </div>
          <div class="footer">
            <Button type="submit" class="btn" variant="outline-primary">
              Update Details
            </Button>
          </div>
          <div>
            {msg}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;