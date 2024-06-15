'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { YuvakAdd } from '@/components/dashboard/yuvak/YuvakAdd';
import { YuvakTable } from '@/components/dashboard/yuvak/YuvakTable';
import { useUserStore } from "@/store/UseStore";

export default function Page() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [userDetails, setUserDetails] = useUserStore((state) => [
    state.userDetailsStore,
    state.updateUserDetails,
  ]);

  const [roles, setRoles] = useUserStore((state) => [
    state.rolesStore,
    state.setRoles,
  ]);



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

  const paginatedRoles = applyPagination(roles, page, rowsPerPage);

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
      <CustomersFilters />
      <YuvakTable
        count={roles.length}
        page={page}
        rows={paginatedRoles}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
      />
      <YuvakAdd open={openAddModal} setOpen={setOpenAddModal} addRole={addRole} />
    </Stack>
  );
}

function applyPagination(rows, page, rowsPerPage) {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
