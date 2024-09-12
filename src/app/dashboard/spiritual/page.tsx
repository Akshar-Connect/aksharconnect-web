/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable eslint-comments/require-description */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/FetchApi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Card, IconButton, Modal, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Text, XAxis, YAxis } from 'recharts';

interface UserProfile {
  sabha: any;
  mandal: any;
  rolesDetails: {
    isNS: boolean;
    isAdmin: boolean;
    sabhaHead: boolean;
  };
}

// const CustomTick = (props) => {
//   const { x, y, payload } = props;
//   return (
//     <Text x={x} y={y} textAnchor="middle" verticalAnchor="start" fontSize={6} fill="#666">
//       {payload.value}
//     </Text>
//   );
// };

const page = () => {
  const [spiritualData, setSpiritualData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [userProfileDetail, setUserProfileDetail] = useState<UserProfile>({});
  const [userAuthIdSH, setUserAuthIdSH] = useState<string | null>(null);
  const [nsListData, setNsListData] = useState([]);
  const [userAuthId, setUserAuthId] = useState(null);
  const [yuvaSevaDetails, setYuvaSevaDetails] = useState([]);
  const [allSabhaNames, setAllSabhaNames] = useState([]);
  const [selectedMandalId, setSelectedMandalId] = useState('');
  // const [selectedMandalId, setSelectedMandalId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    axiosInstance
      .get('/user-auth/complete-profile')
      .then((res) => {
        setUserProfileDetail(res?.data);
        setUserAuthId(res?.data?.id);
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  }, []);

  const sabhaId = selectedMandalId || userProfileDetail?.sabha?.id;
  const mandalId = userProfileDetail?.mandal?.id;
  const mandalName = userProfileDetail?.mandal?.name;

  console.log('selectedMandalId', selectedMandalId);
  console.log('userProfileDetail', userProfileDetail?.id);

  useEffect(() => {
    if (!sabhaId || !mandalId) {
      console.error('Sabha ID or Mandal ID is undefined');
      return;
    }

    axiosInstance
      .get(`sabha/${mandalName}`)
      .then((res) => {
        setAllSabhaNames(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosInstance
      .get('yuva-seva/individual/spiritualring', { params: { authId: userAuthIdSH } })
      .then((res) => {
        setSpiritualData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosInstance
      .post(`attendence/get-NS-attendance-by-weeks?mandalId=${mandalId}&sabhaId=${sabhaId}`)
      .then((res) => {
        setNsListData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosInstance
      .get(`/yuva-seva/find-by-ns/${userAuthIdSH}`)
      .then((res) => {
        setYuvaSevaDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sabhaId, mandalId, userAuthIdSH, selectedMandalId]);
  console.log('spiritualData', spiritualData);

  const isNS = userProfileDetail?.rolesDetails?.isNS;

  const barDataObj = spiritualData.map((item) => {
    const date = new Date(item?.date);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return {
      name: formattedDate,
      YuvaSeva: parseInt(item?.YuvaSeva, 10) || 0,
      Bhajan: parseInt(item?.Bhajan, 10) || 0,
      SwadhyayBhajan: parseInt(item?.SwadhyayBhajan, 10) || 0,
    };
  });

  const uniqueDates = Array.from(new Set(barDataObj.map((item) => item.name)));
  const completeBarDataObj = uniqueDates.map((date) => {
    const filteredData = barDataObj.filter((item) => item.name === date);
    const totalYuvaSeva = filteredData.reduce((sum, item) => sum + item.YuvaSeva, 0);
    const totalBhajan = filteredData.reduce((sum, item) => sum + item.Bhajan, 0);
    const totalSwadhyayBhajan = filteredData.reduce((sum, item) => sum + item.SwadhyayBhajan, 0);
    return {
      name: date,
      YuvaSeva: totalYuvaSeva,
      Bhajan: totalBhajan,
      SwadhyayBhajan: totalSwadhyayBhajan,
    };
  });

  // Limit to 5 bars
  const limitedBarDataObj = completeBarDataObj.slice(0, 5);

  const totalYuvaSevaCount = limitedBarDataObj.reduce((sum, item) => sum + item.YuvaSeva, 0);
  let yuvaSevaHoursForFivedays = (totalYuvaSevaCount / 60).toFixed(2);

  if (Number(yuvaSevaHoursForFivedays) < 1) {
    console.log('Total YuvaSeva Count (in minutes):', totalYuvaSevaCount);
    yuvaSevaHoursForFivedays = totalYuvaSevaCount.toFixed(2); // Keep it in minutes
  } else {
    console.log('Total YuvaSeva Count (in hours):', yuvaSevaHoursForFivedays);
  }

  const totalBhajanCount = limitedBarDataObj.reduce((sum, item) => sum + item.Bhajan, 0);
  let bhajanHoursForFivedays = (totalBhajanCount / 60).toFixed(2);

  if (Number(bhajanHoursForFivedays) < 1) {
    console.log('Total Bhajan Count (in minutes):', totalBhajanCount);
    bhajanHoursForFivedays = totalBhajanCount.toFixed(2); // Keep it in minutes
  } else {
    console.log('Total Bhajan Count (in hours):', bhajanHoursForFivedays);
  }

  const totalSwadhyayBhajanCount = limitedBarDataObj.reduce((sum, item) => sum + item.SwadhyayBhajan, 0);
  let swadhyayBhajanHoursForFivedays = (totalSwadhyayBhajanCount / 60).toFixed(2);

  if (Number(swadhyayBhajanHoursForFivedays) < 1) {
    console.log('Total SwadhyayBhajan Count (in minutes):', totalSwadhyayBhajanCount);
    swadhyayBhajanHoursForFivedays = totalSwadhyayBhajanCount.toFixed(2); // Keep it in minutes
  } else {
    console.log('Total SwadhyayBhajan Count (in hours):', swadhyayBhajanHoursForFivedays);
  }

  const datesPieChart = [
    { name: 'Yuva Seva', value: parseFloat(yuvaSevaHoursForFivedays) },
    { name: 'Bhajan', value: parseFloat(bhajanHoursForFivedays) },
    { name: 'Swadhyay Bhajan', value: parseFloat(swadhyayBhajanHoursForFivedays) },
  ];

  const handlePieClick = (data, index) => {
    console.log('Pie slice clicked:', data, index); // Debug log
    setSelectedProject(data);
    setSelectedIndex(index); // Set the selected slice index
  };

  const rows = nsListData.map((item, index) => {
    return {
      id: index + 1,
      name: `${item?.userAuth?.userProfile?.firstName} ${item?.userAuth?.userProfile?.lastName}`,
      authID: item?.userAuth?.id,
    };
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: false,
    },
  ];

  const handleRowClick = (item: { row: { authID: string } }) => {
    setUserAuthIdSH(item?.row?.authID);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#FF8042'];

  console.log('userAuthIds', userAuthIdSH);

  return (
    <Box>

      <Typography variant="h6">
        Mandal Name: {mandalName}
      </Typography>
      <Typography style={{marginBottom: '10px'}} variant="h6">
        Total Sabha: {allSabhaNames.length}
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {allSabhaNames.map((item, index) => (
          <Card
            onClick={() => {
              setSelectedMandalId(item.id);
              setIsModalOpen(true);
            }}
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '8px',
              padding: '18px',
              height: '100px',
              width: '200px',
              cursor: 'pointer',
            }}
          >
            <p>{item?.name}</p>
          </Card>
        ))}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              // top: '20px',
              left: '280px', // Adjust this value based on the width of your side nav
              width: 'calc(100% - 300px)', // Adjust this value based on the width of your side nav
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <IconButton onClick={handleCloseModal} style={{ position: 'absolute', top: '10px', left: '10px' }}>
              <ArrowBackIcon />
            </IconButton>
            <p style={{ fontWeight: 'bold', marginTop: '40px' }}>Total NS present: {nsListData.length}</p>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <div style={{ height: '100vh' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  onRowClick={(row) => {
                    handleRowClick(row);
                  }}
                  autoHeight={false}
                />
              </div>
              <div>
                {isNS && userAuthIdSH ? (
                  <div>
                    <p style={{ fontWeight: 'bold' }}>Last 5 records</p>
                    <Card>
                      <BarChart
                        width={800}
                        height={300}
                        data={limitedBarDataObj} // Use limitedBarDataObj instead of barDataObj
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="YuvaSeva" stackId="a" fill="#8884d8">
                          {limitedBarDataObj.map(
                            (
                              entry,
                              index // Use limitedBarDataObj instead of barDataObj
                            ) => (
                              <text
                                key={`label-${index}`}
                                x={entry.name}
                                y={entry.YuvaSeva}
                                dy={-10}
                                textAnchor="middle"
                                fill="#8884d8"
                              >
                                {entry.name}
                              </text>
                            )
                          )}
                        </Bar>
                        <Bar dataKey="Bhajan" stackId="a" fill="#82ca9d">
                          {limitedBarDataObj.map((entry, index) => (
                            <text
                              key={`label-${index}`}
                              x={entry.name}
                              y={entry.Bhajan}
                              dy={-10}
                              textAnchor="middle"
                              fill="#82ca9d"
                            >
                              {entry.name}
                            </text>
                          ))}
                        </Bar>
                        <Bar dataKey="SwadhyayBhajan" stackId="a" fill="#FF8042">
                          {limitedBarDataObj.map(
                            (
                              entry,
                              index // Use limitedBarDataObj instead of barDataObj
                            ) => (
                              <text
                                key={`label-${index}`}
                                x={entry.name}
                                y={entry.SwadhyayBhajan}
                                dy={-10}
                                textAnchor="middle"
                                fill="#FF8042"
                              >
                                {entry.name}
                              </text>
                            )
                          )}
                        </Bar>
                      </BarChart>
                    </Card>

                    <Card
                      style={{ marginTop: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                    >
                      {Number(yuvaSevaHoursForFivedays) === 0 &&
                      Number(bhajanHoursForFivedays) === 0 &&
                      Number(swadhyayBhajanHoursForFivedays) === 0 ? (
                        <div>No YuvaSeva done recently</div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                          <PieChart width={300} height={332}>
                            <Pie
                              data={datesPieChart}
                              cx={150}
                              cy={150}
                              outerRadius={125}
                              innerRadius={75}
                              fill="#8884d8"
                              dataKey="value"
                              onClick={(spiritualData, index) => {
                                handlePieClick(spiritualData?.payload, index);
                              }}
                              stroke="none" // Remove default stroke
                              labelLine={false} // Hide the label lines
                              isAnimationActive // Ensure animation is active
                            >
                              {datesPieChart.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                  // stroke={
                                  //   selectedIndex === index ? HIGHLIGHT_COLOR : "transparent"
                                  // }
                                  strokeWidth={1} // Increase the width to make it more visible
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <text x={155} y={170} textAnchor="middle" dominantBaseline="middle" fill="#000">
                              Duration
                            </text>
                          </PieChart>
                          <div>
                            <p style={{ fontWeight: 'bold' }}>
                              Yuva Seva in above 5 days: {yuvaSevaHoursForFivedays}{' '}
                              {Number(yuvaSevaHoursForFivedays) > 10 ? 'minutes' : 'hours'}
                            </p>
                            <p style={{ fontWeight: 'bold' }}>
                              Bhajan in above 5 days: {bhajanHoursForFivedays}{' '}
                              {Number(bhajanHoursForFivedays) > 10 ? 'minutes' : 'hours'}
                            </p>
                            <p style={{ fontWeight: 'bold' }}>
                              Swadhyay Bhajan in above 5 days: {swadhyayBhajanHoursForFivedays}{' '}
                              {Number(swadhyayBhajanHoursForFivedays) > 10 ? 'minutes' : 'hours'}
                            </p>{' '}
                            {yuvaSevaDetails.length > 0 && (
                              <div>
                                <Typography variant="h5" style={{ marginTop: '14px' }}>
                                  Met Yuvak:
                                </Typography>
                                <div>
                                  {yuvaSevaDetails.map((item, index) => (
                                    <div key={index}>
                                      <p style={{ fontWeight: 'bold' }}>
                                        {item?.ys_yuvakName} for {item.ys_time} minutes
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                ) : (
                  'Please select the yuvak name to view the data'
                )}
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </Box>
  );
};

export default page;
