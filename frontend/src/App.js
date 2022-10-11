import { Route, Routes } from "react-router-dom";

import UserProvider from "./contexts/UserContext";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import EditProfile from "./components/EditProfile";
import BookAppointment from "./components/BookAppointment";
import Appointments from "./components/Appointments";
import ScheduleForm from "./components/ScheduleForm";
import Barbers from "./components/Barbers";
import ViewCancelAppointment from "./components/ViewCancelAppointment";
import NotFound from "./pages/NotFound";

const color = "#000";
const theme = createTheme({
  palette: {
    primary: {
      main: color,
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          color,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          color: color,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderColor: color,
          color,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color,
        },
      },
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <UserProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/booking" element={<BookAppointment />} />
                <Route path="/profile" element={<EditProfile />}></Route>
                <Route path="*" element={<NotFound/>}/>
                <Route
                  path="/userAppointments"
                  element={<Appointments type="customer" />}
                ></Route>
                <Route
                  path="/appointment"
                  element={<Appointments type="barber" />}
                />
                <Route path="/scheduleForm" element={<ScheduleForm />} />
                <Route path="/viewcancelappointment" element={<ViewCancelAppointment />} />
                <Route path="/barbers" element={<Barbers />} />
              </Routes>
            </Layout>
          </UserProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
