import React from "react";
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

export const RoleView = ({ open, setOpen, role }) => {
  if (!role) return null;

 

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
            View Role
          </Typography>
        </Box>
        <Box>
          <Button
            sx={{ color: "#fff" }}
            onClick={() => {
              setOpen(false);
              // reset();
            }}
          >
            Close
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box padding={2}>
          <Typography sx={{ fontSize: 20 }}>Role Details</Typography>
          <Divider />
          <Grid container marginTop={2} spacing={3}>
            <Grid item md={3} xs={6}>
              <TextField
                disabled
                id="name"
                name="name"
                label="Sabha Name"
                type="text"
                fullWidth
                variant="outlined"
                value={role.name}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                disabled
                id="day"
                name="Day"
                label="Day"
                multiline
                fullWidth
                variant="outlined"
                value={role.day}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                disabled
                id="location"
                name="Location"
                label="Location"
                multiline
                fullWidth
                variant="outlined"
                value={role.location}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                disabled
                id="sabhaType"
                name="SabhaType"
                label="Sabha Type"
                multiline
                fullWidth
                variant="outlined"
                value={role.sabhaType}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  disabled
                  label="Time"
                  value={new Date(`1970-01-01T${role.time}:00`)}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item md={3} xs={12}>
                <Autocomplete
                disabled
                  options={["Active", "Inactive"]}
                  value={role.status}
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
