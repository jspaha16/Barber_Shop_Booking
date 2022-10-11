import { useReducer, createContext } from "react";

export const UserContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: {} };
    default:
      return state;
  }
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    authReducer,
    {
      user: {},
    },
    () => {
      const localData = localStorage.getItem("user");
      return localData ? {user: JSON.parse(localData)} : { user: {} };
    }
  );

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
