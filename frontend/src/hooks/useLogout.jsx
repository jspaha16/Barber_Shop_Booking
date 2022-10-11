import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export const useLogout = () => {
  const { dispatch } = useContext(UserContext);

  const logout = () => {
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};
