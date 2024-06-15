import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useUserStore } from "@/store/useStore";

export const YuvakAdd = (props) => {
  const { open, setOpen, role } = props;
  const addRole = useUserStore((state) => state.addRole);

  
  const [name, setName] = useState("");
  const [time, setTime] = useState(null);
  const [day, setDay] = useState("");
  const [location, setLocation] = useState("");
  const [sabhaType, setSabhaType] = useState("");
  
  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setTime(role.time ? new Date(`1970-01-01T${role.time}:00`) : null);
      setDay(role.day || "");
      setLocation(role.location || "");
      setSabhaType(role.sabhaType || "");
    }
  }, [role]);
  
  console.log("rororororor", role);

  function reset() {
    setName("");
    setDay("");
    setLocation("");
    setSabhaType("");
    setTime(null); // Reset to null
  }

  async function _onSave() {
    try {
      if (!name || !time || !day || !location || !sabhaType) {
        return;
      }

      // Format the time to a readable string
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      const newRole = { id: Date.now().toString(), name, day, location, sabhaType, time: formattedTime };
      addRole(newRole);
      reset();
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          background: "#6366F1",
          color: "#fff",
          alignItems: "center",
          height: 60,
          padding: "20px",
        }}
      >
        <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Typography color="textPrimary" style={{ color: "#fff" }} gutterBottom variant="h6">
            Add Yuvak
          </Typography>
        </Box>
        <Box>
          <Button
            sx={{ color: "#fff" }}
            onClick={() => {
              setOpen(false);
              reset();
            }}
          >
            Close
          </Button>
          <Button sx={{ color: "#fff" }} onClick={_onSave}>
            Save
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box padding={2}>
          <Typography sx={{ fontSize: 20 }}>Yuvak Details</Typography>
          <Divider />
          <Grid container marginTop={2} spacing={3}>
            <Grid item md={3} xs={6}>
              <TextField
                autoFocus
                id="name"
                name="name"
                label="Yuvak Name"
                type="text"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={12}>
                <Autocomplete
                  options={role}
                  // value={status}
                  // onChange={(event, newValue) => {
                  //   setStatus(newValue);
                  // }}
                  // getOptionLabel={(option) => option}
                  id="state"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Status"
                      variant="outlined"
                      id="status"
                      name="status"
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                id="day"
                name="Day"
                label="Day"
                multiline
                fullWidth
                variant="outlined"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                id="location"
                name="Location"
                label="Location"
                multiline
                fullWidth
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                id="sabhaType"
                name="SabhaType"
                label="Sabha Type"
                multiline
                fullWidth
                variant="outlined"
                value={sabhaType}
                onChange={(e) => setSabhaType(e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Time"
                  value={time}
                  onChange={(newValue) => setTime(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item md={3} xs={12}>
                <Autocomplete
                  options={["Active", "Inactive"]}
                  value={status}
                  onChange={(event, newValue) => {
                    setStatus(newValue);
                  }}
                  getOptionLabel={(option) => option}
                  id="state"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Status"
                      variant="outlined"
                      id="status"
                      name="status"
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
