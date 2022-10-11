import React, { useContext } from "react";
import { UserContext } from "./contexts/UserContext";

import PublicNavBar from "./components/NavBars/PublicNavBar";
import UserNavBar from "./components/NavBars/UserNavBar";

const Layout = ({ children }) => {
  const { user } = useContext(UserContext);
  return (
    <>
      { user.id ? (
        <UserNavBar>{children}</UserNavBar>
      ) : (
        <>
          <PublicNavBar />
          {children}
        </>
      )}
    </>
  );
};

export default Layout;
