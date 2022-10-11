import { Button, MenuItem, TextField } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CancelIcon from '@mui/icons-material/Cancel';
import { UserContext } from '../contexts/UserContext';
const ViewCancelAppointment = () => {

  const [appointmentDate, setAppointmentDate] = useState(null);
  const [barberNames, setBarberNames] = React.useState([]);
  const [barberName, setBarberName] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [appointment, setAppointment] = useState([]);
  const [msg, setMsg] = useState('');

  const { user } = useContext(UserContext);

  //#region BarberNamesPopulate
  useEffect(() => {
    console.log("Nirmal")
    fetch("/api/user/getBarber")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setBarberNames(json.user)
      })
      .catch((err) => {
        console.log(`Error ${err}`);
      });
  }, [])
  //#endregion

  //#region CancelAllAppointment
  //Cancel all the Appointment for a particular day based on Date and Barber
  const onCancelAllAppointment = () => {
    let date= new Date(appointmentDate);
    fetch(`/api/appointment/deleteAppointmentByDateAndBarber?date=${appointmentDate.toDateString()}&barber=${barberName}`, { method: "PUT" })
      .then((res) => {
        return res.json();
      }).then((json)=>{
            if(json.message==="Successfully Updated All Records"){
                setAppointment([]);
                setShowTable(false)
                setMsg("All Appointment deleted!!!")
            }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  //#endregion

  //#region FetchAllAppointments
  //All Appointments for particular date and Barber Name
  const getAppointments = (evt) => {
    evt.preventDefault();

    if (appointmentDate != null && barberName != '') {
      setMsg('');
      fetch(`/api/appointment/getAppointmentsByDateAndBarber?date=${appointmentDate.toDateString()}&barber=${barberName}`)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (json.message) {
            setShowTable(false);
            setMsg(json.message)
          } else {
            setShowTable(true);
            setAppointment(json.appointments);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      if (appointmentDate == null) {
        setMsg('Appointment Date is missing');
      } else {
        setMsg('Barbers Name is not Selected')
      }
    }

  }
  //#endregion

  //#region CancelSingleAppointment
  //Cancel Single Appointment and Update all appointment array
  const onCancelSingleAppointment = (event, bookingId) => {
    fetch(`/api/appointment/deleteAppointment?id=${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: null
    })
    fetch(`/api/appointment/getAppointmentsByDateAndBarber?date=${appointmentDate.toDateString()}&barber=${barberName}`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.message) {
          setShowTable(false)
          setMsg(json.message)
        } else {
          setAppointment(json.appointments);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  //#endregion

  return (
    <div>
      <div className='viewcancelapp'>
        <form noValidate onSubmit={getAppointments}>
          <div>
            <div className='viewfield'>
              <DatePicker
                label="Appointment Date"
                value={appointmentDate}
                onChange={(newValue) => {
                //   var date = new Date();
                //   var d = new Date(newValue.getFullYear() +
                //     "-" + (newValue.getMonth() + 1) +
                //     "-" + (newValue.getDate() +
                //       " " + new Date().getHours() +
                //       ":" + new Date().getMinutes()));
                //   d.setHours(d.getHours() + 4);
                //   console.log(d)
                //   d.setHours(0, 0, 0, 0);
                  setAppointmentDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div className='viewfield'>
              <TextField
                select
                label="Barber's Name"
                onChange={(event) => { setBarberName(event.target.value) }}
                helperText="Please select Barber's Name"
              >
                {barberNames.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.fname}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <div className='book'>
            <Button
              variant="contained"
              type='submit'
            >Get Appointments</Button>
          </div>
        </form>
      </div>
      <div className='tablecontent'>
        <div className='msg'>{msg}</div>
        {showTable && <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600, color: '#f5deb3' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Sr No</TableCell>
                  <TableCell align="center">Booking Id</TableCell>
                  <TableCell align="center">Customer Name</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Time</TableCell>
                  <TableCell align="center">
                    <Button variant="contained"
                      type='button' color='secondary' onClick={onCancelAllAppointment}>Cancel All</Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointment.map((row, index) => (
                  <TableRow
                    key={row.bookingId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="center">{row._id}</TableCell>
                    <TableCell align="center">{row.customer.fname}</TableCell>
                    <TableCell align="center">{row.date}</TableCell>
                    <TableCell align="center">{row.timeSlot.display}</TableCell>
                    <TableCell align="center">
                      <Button onClick={(event) => onCancelSingleAppointment(event, row._id)} startIcon={<CancelIcon />}></Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>}
      </div>
    </div>
  )
}

export default ViewCancelAppointment