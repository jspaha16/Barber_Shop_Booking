import React, { useState } from "react";

import {
  Button,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Box,
  Chip,
  useTheme,
  FormHelperText,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedServices, theme) {
  return {
    fontWeight:
      selectedServices.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const BookAppointment = () => {
  const theme = useTheme();
  const { user } = useContext(UserContext);

  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useState({});

  const handleServices = (event) => {
    setError("");
    const { value } = event.target;
    setSelectedServices(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    if (appointmentDate > new Date()) {
      if (selectedServices.length > 0) {
        if (selectedBarber) {
          if (selectedSlot) {
            if (email && !customer._id) {
              setError("Please provide a valid customer email address");
              return;
            } else if (!email && user.userType === "mg") {
              setError("Cannot leave customer email address empty");
              return;
            }

            fetch("/api/appointment/createAppointment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                barber: selectedBarber,
                customer: email ? customer._id : user.id,
                date: appointmentDate.toDateString(),
                timeSlot: selectedSlot,
                services: selectedServices.map((service) => service._id),
              }),
            })
              .then((res) => res.json())
              .then((json) => {
                if (json.message) {
                  setError(json.message);
                } else {
                  setSelectedBarber("");
                  setSelectedServices([]);
                  setSelectedSlot("");
                  setError("");
                  setSuccess(true);

                  setTimeout(() => setSuccess(false), 5000);
                }
              });
          } else {
            setError("Please select a time slot");
          }
        } else {
          setError("Please select a barber");
        }
      } else {
        setError("Please select at least one service");
      }
    } else {
      setError("Please select a date greater than today");
    }
  };

  useEffect(() => {
    fetch("/api/service/getServices")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setServices(json.services);
      })
      .catch((err) => {
        console.log(`Error ${err}`);
      });

    fetch("/api/user/getActiveBarbers")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setBarbers(json.barbers);
      })
      .catch((err) => {
        console.log(`Error ${err}`);
      });
  }, []);

  useEffect(() => {
    setError("");
    fetch("/api/slot/getSlots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        barber: selectedBarber,
        date: appointmentDate.toDateString(),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.message) {
        } else {
          setSlots(json.slots);
        }
      })
      .catch((err) => {
        console.log(`Error ${err}`);
      });
  }, [selectedBarber, appointmentDate]);

  useEffect(() => {
    setError("");

    const regexExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (regexExp.test(email)) {
      fetch(`/api/user/getUserByEmail/${email}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.message) {
            setError("User with given email not found");
          } else {
            setCustomer(json.user);
          }
        });
    }
  }, [email]);

  return (
    <div>
      {success && (
        <Alert severity="success">Appointment created successfully!</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <center>
        <div className="viewfield">
          <DatePicker
            label="Appointment Date"
            value={appointmentDate}
            onChange={(newValue) => {
              setAppointmentDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>{" "}
      </center>
      <br />
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="services-select-label">Services</InputLabel>
        <Select
          labelId="services-select-label"
          id="service-select"
          multiple
          value={selectedServices}
          onChange={handleServices}
          input={<OutlinedInput id="services-input" label="Services" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((service) => (
                <Chip key={service._id} label={service.name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {services.map((service) => (
            <MenuItem
              key={service._id}
              value={service}
              style={getStyles(service.name, selectedServices, theme)}
            >
              {service.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="barber-list-label">Barber</InputLabel>
        <Select
          labelId="barber-list-label"
          id="barber-list"
          label="Barber"
          onChange={(e) => setSelectedBarber(e.target.value)}
          value={selectedBarber}
        >
          {barbers.map((barber) => {
            return (
              <MenuItem value={barber._id} key={barber._id}>
                {barber.fname} {barber.lname}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>Please select a barber</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="slot-list-label">Slot</InputLabel>
        <Select
          labelId="slot-list-label"
          id="slot-list"
          value={selectedSlot}
          label="Slot"
          onChange={(e) => setSelectedSlot(e.target.value)}
        >
          {slots.length > 0 ? (
            slots.map((slot) => (
              <MenuItem value={slot._id} key={slot._id}>
                {slot.display}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">
              {selectedBarber
                ? "No slot available"
                : "Please select a barber first"}
            </MenuItem>
          )}
        </Select>
        <FormHelperText>Please select a slot</FormHelperText>
      </FormControl>
      {user.userType === "mg" && (
        <FormControl>
          <TextField
            labelId="user-email-input-label"
            label="Customer Email"
            id="customer-email"
            value={email}
            onChange={handleEmail}
          />
          <FormHelperText>Please enter customer's email id</FormHelperText>
        </FormControl>
      )}
      <br />
      <center>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </center>
    </div>
  );
};

export default BookAppointment;
