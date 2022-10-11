import {
  Button,
  Box,
  Grid,
  Typography,
  Alert,
  Modal,
  Backdrop,
  Fade,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  FormControl,
  TextField,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Barbers = () => {
  const { user } = useContext(UserContext);
  const [barbers, setBarbers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [schedule, setSchedule] = useState({});
  const [email, setEmail] = useState("");

  // For Modal
  const [open, setOpen] = React.useState(false);
  const [modalName, setModalName] = useState("");
  const handleOpen = (v) => {
    setModalName(v);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSchedule({});
    setEmail("");

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

  const handleApproval = (status) => {
    fetch("/api/schedule/updateStatus", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        schedule_id: schedule._id,
        user_id: user.id,
        status,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.message) {
          setError(json.message);
        } else {
          setSuccess("Scheduled Approved!");
        }

        handleClose();
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetch("/api/user/getUserByType/barber")
      .then((res) => res.json())
      .then((json) => setBarbers(json.users));
  }, [success, error]);

  return (
    <Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {modalName === "schedule" ? (
              schedule._id ? (
                <>
                  <Typography variant="h6" component="h2">
                    {schedule.barber.fname + " " + schedule.barber.lname}
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {schedule.barber.email}
                  </Typography>
                  <TableContainer component={Paper}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>End Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedule.availability.map((day) => (
                        <TableRow key={day._id}>
                          <TableCell>{day.day}</TableCell>
                          <TableCell>{day.startTime}</TableCell>
                          <TableCell>{day.endTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableContainer>
                  {schedule.status !== "approved" && (
                    <>
                      <Button
                        variant="contained"
                        sx={{ my: 2 }}
                        onClick={() => handleApproval("approved")}
                      >
                        Approve Schedule
                      </Button>
                      {schedule.status === "pending" && (
                        <Button
                          variant="contained"
                          sx={{ my: 2 }}
                          onClick={() => handleApproval("rejected")}
                        >
                          Reject Schedule
                        </Button>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Typography>Barber does not have a schedule yet</Typography>
              )
            ) : (
              <>
                <FormControl>
                  <TextField
                    labelId="user-email-input-label"
                    label="Customer Email"
                    id="customer-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormHelperText>
                    Please enter customer's email id to promote to barber
                  </FormHelperText>
                </FormControl>
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={() => {
                    fetch("/api/user/makeBarber", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        userEmail: email,
                        managerId: user.id,
                      }),
                    })
                      .then((res) => res.json())
                      .then((json) => {
                        if (
                          json.message ===
                          "User promoted to barber successfully!"
                        ) {
                          setSuccess(json.message);
                        } else {
                          setError(json.message);
                        }

                        handleClose();
                      })
                      .catch((err) => setError(err.message));
                  }}
                >
                  Submit
                </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
      <Box sx={{ m: 3 }}>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
      <Box>
        <Button variant="contained" onClick={() => handleOpen("barber-email")}>
          <AddBoxIcon /> Add Barber
        </Button>
      </Box>
      <Box>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {barbers.map((barber) => (
            <Grid item sx={4} key={barber._id}>
              <Box
                sx={{
                  backgroundColor: "#000000",
                  color: "wheat",
                  borderRadius: "25px",
                  minWidth: "450px",
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography>
                    {barber.fname} {barber.lname}
                  </Typography>
                  <Typography>{barber.email}</Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      fetch(`/api/schedule/getScheduleByBarber/${barber._id}`)
                        .then((res) => res.json())
                        .then((json) => {
                          if (!json.message) {
                            setSchedule(json.schedule);
                          }
                        });

                      handleOpen("schedule");
                    }}
                  >
                    View Schedule
                  </Button>
                  {user.email !== barber.email && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        fetch(`/api/user/removeBarber/${barber._id}`, {
                          method: "PUT",
                        })
                          .then((res) => res.json())
                          .then((json) => {
                            if (
                              json.message === "Barber removed successfully!"
                            ) {
                              setSuccess(json.message);
                              setTimeout(() => setSuccess(""), 5000);
                            } else {
                              setError(json.message);
                              setTimeout(() => setError(""), 5000);
                            }
                          });
                      }}
                    >
                      Remove Barber
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Barbers;
