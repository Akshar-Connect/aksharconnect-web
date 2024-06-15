import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography
} from "@mui/material";

export const YuvakEdit = (props) => {
  const { open, setOpen, addRole } = props;
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [day, setDay] = useState("");

  function reset() {
    setRole("");
    setName("");
    setDay("");
  }

  async function _onSave() {
    try {
      if (!name || !role || !day) {
        return;
      }

      const newRole = { id: Date.now().toString(), name, role, day };
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
            Add Role
          </Typography>
        </Box>
        <Box>
          <Button sx={{ color: "#fff" }} onClick={() => { setOpen(false); reset(); }}>
            Close
          </Button>
          <Button sx={{ color: "#fff" }} onClick={_onSave}>Save</Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box padding={2}>
          <Typography sx={{ fontSize: 20 }}>Role Details</Typography>
          <Divider />
          <Grid container marginTop={2} spacing={3}>
            <Grid item md={3} xs={6}>
              <TextField
                autoFocus
                id="name"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="filled"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                id="role"
                name="Role"
                label="Role"
                multiline
                fullWidth
                variant="filled"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                id="day"
                name="Day"
                label="Day"
                multiline
                fullWidth
                variant="filled"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
