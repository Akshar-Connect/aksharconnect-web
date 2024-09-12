/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/FetchApi';
import EditIcon from '@mui/icons-material/Edit';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

export function RoleView({ open, setOpen, role }) {
  const [yuvakData, setYuvakData] = useState({});
  const [updatedValue, setUpdatedValue] = useState({});
  const [allSabha, setAllSabha] = useState([]);
  const currMandalName = 'Akshar Yuvak Mandal';
  const [updatedSabhaValue, setUpdatedSabhaValue] = useState({ sabhaName: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressParts, setAddressParts] = useState({
    flat: '',
    building: '',
    area: '',
    suburb: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    gender: '',
    dob: '',
    bloodGroup: '',
    padharamniDone: '',
    samaiyaReg: '',
    isSabhaAttending: '',
    flat: '',
    building: '',
    area: '',
    suburb: '',
    city: '',
    state: '',
    pincode: '',
    address: {
      flat: '',
      building: '',
      area: '',
      suburb: '',
      city: '',
      state: '',
      pincode: '',
    },
    seva: '',
    roles: {
      userAuth: {
        emailId: '',
      },
    },
    sabha: {
      name: '',
      location: '',
      time: '',
    },
  });

  useEffect(() => {
    if (!role) return;

    axiosInstance
      .get('user-auth/find-by-aksharconnectId', { params: { aksharId: role } })
      .then((res) => {
        setYuvakData(res.data);
        console.log('yuvakData', yuvakData);
      })
      .catch((err) => console.log('Error fetching data:', err));
  }, [role]);

  useEffect(() => {
    axiosInstance
      .get(`/sabha/${currMandalName}`)
      .then((res) => {
        setAllSabha(res.data);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  }, [yuvakData]);

  console.log('yuvakData', yuvakData);

  const sabhaList = allSabha.map((sabha) => sabha.name);
  // console.log('sabhaList', sabhaList);

  const roles = yuvakData?.rolesDetails;
  const rolesList = Object.keys(roles || {});
  console.log('rolesList', rolesList);

  const filtered = Object.entries(roles || {})
    .filter(([key, value]) => value === true || value === '1')
    .map(([key]) => key);

  console.log('filtered', filtered);

  useEffect(() => {
    if (yuvakData && yuvakData.userProfile && yuvakData.address) {
      setFormValues((prevValues) => ({
        ...prevValues,
        ...yuvakData.userProfile,
        phone: yuvakData.userProfile.phoneNumber?.replace('+91', ''),
        address: yuvakData.address || {},
      }));
    }
  }, [yuvakData]);

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => {
      if (field in prevValues.address) {
        return {
          ...prevValues,
          address: {
            ...prevValues.address,
            [field]: value,
          },
        };
      } else if (field === 'sabha') {
        return {
          ...prevValues,
          sabha: value,
        };
      }
      return {
        ...prevValues,
        [field]: value,
      };
    });
  };

  const handleInputSabhaChange = (event) => {
    const { name, value } = event.target;
    setUpdatedSabhaValue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    let profileObj = yuvakData['address'] ? yuvakData['address'] : {};
    profileObj = { ...yuvakData?.userProfile, ...profileObj };
    profileObj['firstName'] = formValues.firstName || yuvakData.userProfile?.firstName;
    profileObj['lastName'] = formValues.lastName || yuvakData.userProfile?.lastName;
    profileObj['middleName'] = formValues.middleName || yuvakData.userProfile?.middleName;
    profileObj['phoneNumber'] = '+91' + (formValues.phone || yuvakData.userProfile?.phoneNumber);
    profileObj['gender'] = formValues.gender || yuvakData.userProfile?.gender;
    profileObj['dob'] = formValues.dob || yuvakData.userProfile?.dob;
    profileObj['bloodGroup'] = formValues.bloodGroup || yuvakData.userProfile?.bloodGroup;
    profileObj['padharamni'] = formValues.padharamniDone || yuvakData.userProfile?.padharamni;
    profileObj['padharamniSeva'] = formValues.seva || yuvakData.userProfile?.padharamniSeva;
    profileObj['aymRegister'] = formValues.samaiyaReg || yuvakData.userProfile?.aymRegister;
    profileObj['email'] = formValues?.roles?.userAuth?.emailId || yuvakData.userProfile?.email;
    profileObj['akcId'] = yuvakData?.aksharId;
    profileObj['isAttending'] = formValues.isSabhaAttending || yuvakData.userProfile?.isAttending;

    // Add address fields
    profileObj['flat'] = formValues.address?.flat || yuvakData.address?.flat;
    profileObj['building'] = formValues.address?.building || yuvakData.address?.building;
    profileObj['area'] = formValues.address?.area || yuvakData.address?.area;
    profileObj['suburb'] = formValues.address?.suburb || yuvakData.address?.suburb;
    profileObj['city'] = formValues.address?.city || yuvakData.address?.city;
    profileObj['state'] = formValues.address?.state || yuvakData.address?.state;
    profileObj['pincode'] = formValues.address?.pincode || yuvakData.address?.pincode;

    // Add sabha fields
    profileObj['sabhaName'] = formValues.sabha?.name || yuvakData?.sabha?.name;
    profileObj['sabhaLocation'] = formValues?.sabha?.location || yuvakData?.sabha?.location;
    profileObj['sabhaTime'] = formValues?.sabha?.time || yuvakData?.sabha?.time;

    // Add address parts
    profileObj['address'] =
      `${formValues.address?.flat}, ${formValues.address?.building}, ${formValues.address?.area}, ${formValues.address?.suburb}, ${formValues.address?.city}, ${formValues.address?.state}, ${formValues.address?.pincode}`;

    console.log('Profile Object:::::::::::::::::', profileObj);
    setUpdatedValue(profileObj);
  }, [formValues, yuvakData, addressParts]);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('updatedValue', updatedValue);

    axiosInstance
      .post('user-profile', updatedValue)
      .then((response) => {
        console.log('Form data sent successfully:', response.data);
        alert('Data Updated Successfully');
      })
      .catch((error) => console.error('Error sending form data:', error));

    // axiosInstance
    //   .post('user-sabha-details', updatedSabhaValue)
    //   .then((response) => {
    //     setUpdatedValue(response.data);
    //     console.log('Form data sent successfully:', response.data);
    //     alert('Sabha Data Updated Successfully');
    //     setIsModalOpen(false);
    //   })
    //   .catch((error) => console.error('Error sending form data:', error));
  };

  const handleModalSubmit = () => {
    setUpdatedValue((prevValues) => ({
      ...prevValues,
      address: `${addressParts?.flat}, ${addressParts?.building}, ${addressParts?.area}, ${addressParts?.suburb}, ${addressParts?.city}, ${addressParts?.state}, ${addressParts?.pincode}`,
    }));
    setIsModalOpen(false);
  };

  console.log('updatedSabhaValue', updatedSabhaValue);

  if (!yuvakData) return null;

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
      <DialogTitle
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          background: '#6366F1',
          color: '#fff',
          alignItems: 'center',
          height: 60,
          padding: '20px',
        }}
      >
        <Typography variant="h6" gutterBottom>
          View Role
        </Typography>
        <Button sx={{ color: '#fff' }} onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box padding={2}>
          <Typography sx={{ fontSize: 20 }}>Role Details</Typography>
          <Divider />
          <Grid container marginTop={2} spacing={3}>
            <Grid item md={3} xs={6}>
              <TextField
                label="First Name"
                fullWidth
                variant="outlined"
                value={formValues?.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                label="Middle Name"
                fullWidth
                variant="outlined"
                value={formValues?.middleName || ''}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                label="Last Name"
                fullWidth
                variant="outlined"
                value={formValues?.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <Autocomplete
                options={sabhaList}
                value={updatedSabhaValue.sabhaName}
                onChange={handleInputSabhaChange}
                renderInput={(params) => <TextField {...params} label="Change Sabha" variant="outlined" fullWidth />}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                label="Phone Number"
                fullWidth
                variant="outlined"
                value={formValues?.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                label="Email Id"
                fullWidth
                variant="outlined"
                value={formValues?.email || ''}
                onChange={(e) => handleInputChange('emailId', e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                multiline
                value={`${formValues?.address?.flat}, ${formValues?.address?.building}, ${formValues?.address?.area}, ${formValues?.address?.suburb}, ${formValues?.address?.city}`}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setIsModalOpen(true)}>
                      <EditIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateField', 'DateField', 'DateField']}>
                  <DatePicker
                    label="Birthday"
                    value={formValues?.dob ? dayjs(formValues.dob) : null}
                    slotProps={{ textField: { size: 'medium' } }}
                    onChange={(e) => handleInputChange('dob', e.toISOString())}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                options={['Male', 'Female']}
                value={formValues?.gender || ''}
                onChange={(event, newValue) => handleInputChange('gender', newValue)}
                renderInput={(params) => <TextField {...params} label="Gender" variant="outlined" fullWidth />}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                options={['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-', 'E']}
                value={formValues?.bloodGroup || ''}
                onChange={(event, newValue) => handleInputChange('bloodGroup', newValue)}
                renderInput={(params) => <TextField {...params} label="Blood Group" variant="outlined" fullWidth />}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                options={['Yes', 'No']}
                value={formValues?.samaiyaReg || ''}
                onChange={(event, newValue) => handleInputChange('samaiyaReg', newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Yuva Mahotsav Registration" variant="outlined" fullWidth />
                )}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                label="Padhramni Seva"
                fullWidth
                variant="outlined"
                value={formValues?.seva || ''}
                onChange={(e) => handleInputChange('seva', e.target.value)}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                options={['Yes', 'No']}
                value={formValues?.isSabhaAttending || (yuvakData?.sabhaDetails?.isAttending ? 'Yes' : 'No')}
                onChange={(event, newValue) => handleInputChange('isSabhaAttending', newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Sabha Attending Status" variant="outlined" fullWidth />
                )}
              />
            </Grid>

            <Grid item md={3} xs={12}>
              <Autocomplete
                multiple
                options={rolesList}
                value={filtered}
                onChange={(event, newValue) => handleInputChange('roles', newValue)}
                renderInput={(params) => <TextField {...params} label="Role" variant="outlined" fullWidth />}
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </Box>
        </Box>
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div style={{ padding: 20, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '50%' }}>
            <h2>Edit Address</h2>
            <TextField
              label="Flat"
              variant="outlined"
              fullWidth
              value={formValues?.address?.flat || ''}
              onChange={(e) => handleInputChange('flat', e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Building"
              variant="outlined"
              fullWidth
              value={formValues?.address?.building}
              onChange={(e) => handleInputChange('building', e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Area"
              variant="outlined"
              fullWidth
              value={formValues?.address?.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Suburb"
              variant="outlined"
              fullWidth
              value={formValues?.address?.suburb}
              onChange={(e) => handleInputChange('suburb', e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              value={formValues?.address?.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="State"
              variant="outlined"
              fullWidth
              value={formValues?.address?.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Pincode"
              variant="outlined"
              fullWidth
              value={formValues?.address?.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <Button onClick={handleModalSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </div>
        </Modal>
      </DialogContent>
    </Dialog>
  );
}
