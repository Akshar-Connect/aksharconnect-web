/* eslint-disable no-console */
'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/UseStore';
import axiosInstance from '@/utils/FetchApi';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Card, InputAdornment, OutlinedInput } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { v4 as uuidv4 } from 'uuid';

import { RoleAdd } from '@/components/dashboard/role/RoleAdd';
import { RoleTable } from '@/components/dashboard/role/RoleTable';
import { RoleView } from '@/components/dashboard/role/RoleView';

export default function Page() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [yuvakData, setYuvakData] = React.useState([]);
  const [openViewModal, setOpenViewModal] = React.useState(false);

  const [selectedRole, setSelectedRole] = React.useState(null);

  const [userDetails, setUserDetails] = useUserStore((state) => [state.userDetailsStore, state.updateUserDetails]);

  const [roles, setRoles] = useUserStore((state) => [state.rolesStore, state.setRoles]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'aksharId',
      headerName: 'Akshar ID',
      width: 150,
      editable: false,
    },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: false,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: false,
    },
    {
      field: 'middleName',
      headerName: 'Middle name',
      width: 150,
      editable: false,
    },
    {
      field: 'sabha',
      headerName: 'Sabha',
      width: 150,
      editable: false,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      editable: false,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleViewRole(params.row.aksharId)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  const handleViewRole = (aksharId) => {
    setSelectedRole(aksharId);
    setOpenViewModal(true);
  };

  const rows =
    yuvakData.map((data, index) => {
      return {
        id: index + 1, // Sequential ID starting from 1
        authId: data?.userAuth?.id,
        aksharId: data?.userAuth?.aksharId,
        firstName: data?.firstName,
        lastName: data?.lastName,
        middleName: data?.middleName,
        sabha: data?.userAuth?.sabha?.name,
        role: data?.userAuth?.rolesDetails.isNS
          ? 'NS'
          : data?.userAuth?.sabha?.name?.includes('Yuvati')
            ? 'Yuvati'
            : 'Yuvak',
      };
    }) || [];

  console.log(rows, columns);

  const handleRolesUpdate = (newRoles) => {
    setRoles(newRoles);
  };

  const addRole = (roleData) => {
    handleRolesUpdate([...roles, roleData]);
  };

  useEffect(() => {
    const requestSearch = async () => {
      try {
        const profResp = await axiosInstance.get('/user-profile/find-by-name-like', {
          params: { name: searchTerm },
        });
        const data = profResp.data;
        const yuvakDataArray = Object.values(data);
        setYuvakData(yuvakDataArray);
      } catch (error) {
        console.error(`Error occurs while fetching Yuvak Data: ${error}`);
      }
    };

    if (searchTerm) {
      requestSearch();
    }
  }, [searchTerm]);

  console.log(searchTerm);

  // const paginatedRoles = applyPagination(roles, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Role</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => setOpenAddModal(true)}
          >
            Add
          </Button>
        </div>
      </Stack>

      <Card sx={{ p: 2 }}>
        <OutlinedInput
          defaultValue=""
          fullWidth
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Search Yuvak"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
        />
      </Card>

      {searchTerm.length > 0 ? (
        <DataGrid rows={rows} columns={columns} />
      ) : (
        <p>Please search for the name you are looking for!</p>
      )}

      <RoleView open={openViewModal} setOpen={setOpenViewModal} role={selectedRole} />

      {/* <RoleTable
        count={roles.length}
        page={page}
        rows={paginatedRoles}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
      /> */}
      {/* <RoleAdd open={openAddModal} setOpen={setOpenAddModal} addRole={addRole} /> */}
    </Stack>
  );
}

// function applyPagination(rows, page, rowsPerPage) {
//   return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
// }
