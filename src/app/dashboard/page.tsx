/* eslint-disable no-console */
'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import axiosInstance from '../../utils/FetchApi';

interface AttendanceData {
  presentCount: number;
  date: string;
}

interface Sabha {
  name: string;
}

export default function Page(): React.JSX.Element {
  const [currSabha, setCurrSabha] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [xAxisData, setXAxis] = useState<number[]>([]);
  const [lastFiveDates, setLastFiveDates] = useState<string[]>([]);
  const [mandalNames, setMandalNames] = useState<[]>([]);
  const [allSabha, setAllSabha] = useState<Sabha[]>([]);
  const [currMandalName, setCurrMandalName] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<string>({});
  const [userProfileDetail, setUserProfileDetail] = useState<string>({});

  const userDetails = currentUser.userProfile;
  const userRoleDetails = currentUser.roleDetails;

  console.log('userRoleDetailssssssssss', userRoleDetails)



  const handleChange = (event: SelectChangeEvent) => {
    setCurrSabha(event.target.value);
  };
  const handleChangeMandal = (event: SelectChangeEvent) => {
    setCurrMandalName(event.target.value);
  };

  // useEffect(()=>{
  //   axiosInstance
  //   .get('user-auth/getAkcId')
  //   .then((res) => {
  //     console.log('AC IDxs----------??>>>>',res.data)
  //   })
  //   .catch((err)=>{
  //     console.log(err)
  //   })
  // },[])

  useEffect(()=>{
    axiosInstance
    .get('user-auth/find-by-aksharconnectId/', { params: { aksharId: 'AC12084' } })
    .then((res) => setCurrentUser(res.data))
    .catch((err) => console.log(err));
  },[])

  console.log(currentUser?.userProfile?.firstName)


  useEffect(() => {
    if (currSabha) {
      axiosInstance
        .get<{ data: AttendanceData[] }>('attendence/attendences/dashboardCount', {
          params: { mandalName: currMandalName, sabhaName: currSabha },
        })
        .then((res) => {
          setAttendanceData(res.data);
        })
        .catch((err: unknown) => {
          console.error('Error fetching data:', err);
        });
    }
  }, [currSabha]);

  console.log('attendanceData', attendanceData);

  useEffect(() => {
    axiosInstance
      .get('mandal/names')
      .then((res) => {
        setMandalNames(res.data);
      })
      .catch((err: unknown) => {
        console.error('Error fetching data:', err);
      });
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`/sabha/${currMandalName}`)
      .then((res) => {
        setAllSabha(res.data);
      })
      .catch((err: unknown) => {
        console.error('Error fetching data:', err);
      });
  }, [currMandalName]);

  useEffect(() => {
    if (attendanceData.length > 0) {
      const xAxisDataSet = attendanceData.map((item) => item.presentCount);
      const Last5Dates = attendanceData
        .map((item) => item.date)
        .map((date) => {
          const parsedDate = new Date(date);
          return parsedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
        });

      setLastFiveDates(Last5Dates);
      setXAxis(xAxisDataSet);
    }
  }, [attendanceData]);

  console.log('lastFiveDates', lastFiveDates);
  console.log('xAxisDataSet', xAxisData);
  const NoOfDates = lastFiveDates.map(Number);
  console.log('NoOfDates', NoOfDates);

  const data = lastFiveDates.map((date, index) => {
    const formattedDate = date;
    const attendance = xAxisData[index];
    return { date: formattedDate, attendance };
  });

  console.log('data', data);


  useEffect(() => {
    axiosInstance
      .get('/user-auth/complete-profile')
      .then((res) => {
       setUserProfileDetail(res?.data);
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  }, []);


  return (
    <div className="mb-6">
      <div className='mb-4'>
      <b>Welcome {userProfileDetail?.userProfile?.firstName + ' ' + userProfileDetail?.userProfile?.middleName + ' ' + userProfileDetail?.userProfile?.lastName},</b>
      </div>
      <div className="flex flex-row mt-6">
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Mandal Name</InputLabel>
            <Select
              labelId="mandal-names-label"
              id="mandalNamesList"
              value={currMandalName}
              label="Mandal Name"
              onChange={handleChangeMandal}
            >
              {mandalNames.map((item, key) => (
                <MenuItem key={key} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: 120, marginTop: '20px' }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sabha</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currSabha}
              label="Sabha"
              onChange={handleChange}
            >
              {allSabha.map((item, key) => (
                <MenuItem key={key} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="attendance" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
