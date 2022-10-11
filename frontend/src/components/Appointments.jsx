import React, { useContext } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Appointments = ({ type }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("scheduled");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleStatus = (status, id) => {
    fetch(`/api/appointment/changeStatus?id=${id}&status=${status}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.message === "Status updated successfully!") {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 5000);
          setBookings((prev) =>
            prev.filter((appointment) => appointment._id !== id)
          );
        } else {
          setError(json.message);
          setTimeout(() => setError(""), 5000);
        }
      });
  };

  useEffect(() => {
    if (user.id) {
      fetch(`/api/appointment/getAppointment?type=${type}&userId=${user.id}`)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          setBookings(
            json.appointments.filter(
              (booking) => booking.status === statusFilter
            )
          );
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      navigate("/");
    }
  }, [user, navigate, statusFilter, type]);

  return (
    <div>
      {success && (
        <Alert severity="success">Appointment canceled successfully!</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select
          labelId="status-select-label"
          id="status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Status"
        >
          <MenuItem value="scheduled">Scheduled</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {bookings.map((booking) => {
          const date = new Date(booking.date);
          return (
            <Grid item xs={6} key={booking._id}>
              <Box
                sx={{
                  backgroundColor: "#000000",
                  color: "wheat",
                  borderRadius: "25px",
                  minWidth: "450px",
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">
                    Barber: {booking.barber.fname + " " + booking.barber.lname}
                  </Typography>
                  <Typography variant="h6">
                    Booking Id: {booking._id}
                  </Typography>
                  <Typography variant="h6">
                    Date: {date.toUTCString().slice(0, 16)}
                  </Typography>
                  <Typography variant="h6">
                    Time:{" "}
                    {booking.timeSlot?.display || "Time slot not available"}
                  </Typography>
                  {statusFilter === "scheduled" && (
                    <>
                      <Button
                        sx={{ backgroundColor: "wheat", color: "black", mt: 2 }}
                        variant="contained"
                        onClick={() => handleStatus("cancelled", booking._id)}
                      >
                        Cancel Appointment
                      </Button>
                      {user.userType !== "cs" && (
                        <Button
                          sx={{
                            backgroundColor: "wheat",
                            color: "black",
                            mt: 2,
                          }}
                          variant="contained"
                          onClick={() => handleStatus("completed", booking._id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Appointments;
