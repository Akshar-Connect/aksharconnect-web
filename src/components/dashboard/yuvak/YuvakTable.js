'use client';

import * as React from 'react';
import { useUserStore } from '@/store/UseStore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Grid } from 'react-loader-spinner';

import { RoleView } from '@/components/dashboard/role/RoleView';

export function YuvakTable(props) {
  const { count, page, rows, rowsPerPage, onPageChange, onRowsPerPageChange } = props;

  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(null);
  // const [loader, setLoader] = React.useState(true);

  const visibleRows = React.useMemo(
    () => Object.values(rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, rows]
  );

  const handleViewRole = (aksharId) => {
    setSelectedRole(aksharId);
    setOpenViewModal(true);
  };

  const deleteRole = useUserStore((state) => state.deleteRole);

  const handleDeleteRole = (roleId) => {
    deleteRole(roleId);
  };

  return (
    <>
      <Card>
        <Box sx={{ minWidth: 800 }}>
          {visibleRows.length < 0 ? (
            <Grid
              visible={true}
              height="40"
              width="40"
              color="#4fa94d"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass="grid-wrapper"
            />
          ) : (
            <div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr. No</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Middle Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>UserAuth ID</TableCell>
                    <TableCell>Akshar ID</TableCell>
                    <TableCell>Sabha Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((yuvak, index) => (
                    <TableRow key={yuvak.userAuth.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{yuvak.firstName}</TableCell>
                      <TableCell>{yuvak.middleName}</TableCell>
                      <TableCell>{yuvak.lastName}</TableCell>
                      <TableCell>{yuvak.userAuth.id}</TableCell>
                      <TableCell>{yuvak.userAuth.aksharId}</TableCell>
                      <TableCell>{yuvak.userAuth.sabha.name}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleViewRole(yuvak.userAuth.aksharId)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteRole(yuvak.userAuth.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[25, 50, 75, 100]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
              />
            </div>
          )}
        </Box>
      </Card>
      <RoleView open={openViewModal} setOpen={setOpenViewModal} role={selectedRole} />
    </>
  );
}
