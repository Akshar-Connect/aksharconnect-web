'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/UseStore';
import axiosInstance from '@/utils/FetchApi';
import { Card, InputAdornment, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { YuvakAdd } from '@/components/dashboard/yuvak/YuvakAdd';
import { YuvakTable } from '@/components/dashboard/yuvak/YuvakTable';

export default function Page() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [yuvakData, setYuvakData] = React.useState([]);

  React.useEffect(() => {
    const requestSearch = async () => {
      try {
        let data;
        const profResp = await axiosInstance.get('/user-profile/find-by-name-like', { params: { name: searchTerm } });

        data = profResp.data;
        setYuvakData(data);
      } catch (error) {
        throw new Error(`Error occurs while fetching Yuvak Data, ${error}`);
      }
    };
    requestSearch();
  }, [searchTerm]);

  const [userDetails, setUserDetails] = useUserStore((state) => [state.userDetailsStore, state.updateUserDetails]);

  const [roles, setRoles] = useUserStore((state) => [state.rolesStore, state.setRoles]);

  const handleUserDetailsUpdate = (newDetails) => {
    setUserDetails(newDetails);
  };

  const handleRolesUpdate = (newRoles) => {
    setRoles(newRoles);
  };

  const addRole = (roleData) => {
    handleRolesUpdate([...roles, roleData]);
  };

  useEffect(() => {
    if (userDetails === null) {
      handleUserDetailsUpdate({ name: 'John Doe', email: 'john.doe@example.com' });
    }
  }, [userDetails]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Yuvak</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
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
      <YuvakTable
        count={Number(Object.values(yuvakData).length)}
        page={page}
        rows={yuvakData}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        searchTerm={searchTerm}
      />
      <YuvakAdd open={openAddModal} setOpen={setOpenAddModal} addRole={addRole} />
    </Stack>
  );
}
