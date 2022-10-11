import React from "react";
import {
  TextField,
  MenuItem,
  Typography,
  Grid,
  Button,
  IconButton,
  Alert,
  Modal,
  Backdrop,
  Fade,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

const ScheduleForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [schedule, setSchedule] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState("");
  const [availability, setAvailability] = useState([
    { day: "Monday", startTime: 9, endTime: 13 },
    { day: "Tuesday", startTime: 9, endTime: 13 },
    { day: "Wednesday", startTime: 9, endTime: 13 },
    { day: "Thursday", startTime: 9, endTime: 13 },
    { day: "Friday", startTime: 9, endTime: 13 },
    { day: "Saturday", startTime: 9, endTime: 13 },
  ]);

  // For Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [checkedState, setCheckedState] = useState(
    new Array(days.length).fill(false)
  );

  const getTimes = (index, direction) => {
    const times = [];
    let isDisabled = false;

    for (let i = 9; i <= 21; i++) {
      if (direction === "start") {
        isDisabled = availability[index].endTime - i < 4;
      } else {
        isDisabled = i - availability[index].startTime < 4;
      }

      times.push(
        <MenuItem value={i} key={i} disabled={isDisabled}>
          {i}
        </MenuItem>
      );
    }

    return times;
  };

  const handleChange = (e, day, targetTime) => {
    const { value } = e.target;

    if (status) {
      setStatus("");
    }

    setAvailability((current) =>
      current.map((obj) => {
        if (obj.day === day) {
          return { ...obj, [targetTime]: value };
        }

        return obj;
      })
    );
  };

  const checkDay = (target) => {
    let disabled = false;

    const targetAvailability = availability.find((obj) => obj.day === target);

    if (targetAvailability) {
      disabled = true;
    }

    return disabled;
  };

  const handleChecked = (index) => {
    setCheckedState((prev) =>
      prev.map((item, i) => (index === i ? !item : item))
    );
  };

  const addDays = () => {
    days.forEach((day, i) => {
      if (checkedState[i]) {
        setAvailability((current) => [
          ...current,
          { day, startTime: 9, endTime: 13 },
        ]);
      }
    });

    setCheckedState((prev) => prev.map(() => false));
    setStatus("");
    handleClose();
  };

  const handleDelete = (day) => {
    setAvailability((current) => current.filter((item) => item.day !== day));
    setStatus("");
  };

  const handleSubmit = () => {
    let allGood = false;

    availability.every((day) => {
      if (day.endTime - day.startTime < 4) {
        allGood = false;
      } else {
        allGood = true;
      }

      return allGood;
    });

    if (allGood) {
      if (schedule) {
        fetch("/api/schedule/updateSchedule", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            availability,
            id: schedule,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.message) {
              setError(json.message);
            } else {
              setAvailability(json.schedule.availability);
              setStatus(json.schedule.status);
              setSuccess("Schedule updated successfully!");
            }
          })
          .catch((err) => console.log(err));
      } else {
        fetch("/api/schedule/createSchedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            availability,
            barber: user.id,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.message) {
              setError(json.message);
            } else {
              setAvailability(json.schedule.availability);
              setStatus(json.schedule.status);
              setSuccess("Schedule created successfully!");
            }
          })
          .catch((err) => console.log(err));
      }

      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
    } else {
      setError("Start time cannot be greater than end time");
    }
  };

  useEffect(() => {
    if (user.userType === "mg" || user.userType === "bb") {
      fetch(`/api/schedule/getScheduleByBarber/${user.id}`)
        .then((res) => res.json())
        .then((json) => {
          if (!json.message) {
            setAvailability(json.schedule.availability);
            setStatus(json.schedule.status);
            setSchedule(json.schedule._id);
          }
        })
        .catch((err) => console.log(err));
    } else {
      navigate("/appointment");
    }
  }, [user, navigate]);

  return (
    <>
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
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Select days to add to schedule
            </Typography>
            <FormGroup>
              {days.map((day, index) => (
                <FormControlLabel
                  key={day}
                  disabled={checkDay(day)}
                  control={<Checkbox />}
                  label={day}
                  onChange={() => handleChecked(index)}
                />
              ))}
              <Button variant="contained" onClick={addDays}>
                Add Days
              </Button>
            </FormGroup>
          </Box>
        </Fade>
      </Modal>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Grid container sx={{ p: 4 }}>
        {status && (
          <Grid item xs={9}>
            <Typography variant="h4">Status: {status}</Typography>
          </Grid>
        )}
        <Grid item xs={3} justifyContent="start" display="flex" sx={{ p: 2 }}>
          <Button onClick={handleOpen} variant="contained">
            <AddBoxIcon /> Add Days
          </Button>
        </Grid>
      </Grid>

      {availability.map((day, index) => (
        <Grid container spacing={2} key={day.day} sx={{ width: "90vw" }}>
          <Grid
            item
            xs={3}
            justifyContent="center"
            display="flex"
            sx={{ textAlign: "center", p: 2 }}
          >
            <Typography variant="h6">{day.day}</Typography>
          </Grid>
          <Grid
            item
            sx={{ p: 3, maxWidth: 200 }}
            xs={3}
            justifyContent="center"
            display="flex"
          >
            <TextField
              id={`${day.day}-startTime`}
              select
              label="Start Time"
              value={availability[index].startTime}
              onChange={(e) => handleChange(e, day.day, "startTime")}
              helperText={`Please select your start time for ${day.day}`}
            >
              {getTimes(index, "start")}
            </TextField>
          </Grid>
          <Grid
            item
            sx={{ p: 3, maxWidth: 125 }}
            xs={3}
            justifyContent="center"
            display="flex"
          >
            <TextField
              id={`${day.day}-endTime`}
              select
              label="End Time"
              value={availability[index].endTime}
              onChange={(e) => handleChange(e, day.day, "endTime")}
              helperText={`Please select your end time for ${day.day}`}
            >
              {getTimes(index, "end")}
            </TextField>
          </Grid>
          <Grid item xs={3} justifyContent="start" display="flex" sx={{ p: 2 }}>
            <IconButton onClick={() => handleDelete(day.day)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid container sx={{ p: 3 }}>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ScheduleForm;
