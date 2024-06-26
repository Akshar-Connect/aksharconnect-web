'use client';

import * as React from 'react';
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { RoleView } from '@/components/dashboard/role/RoleView';
import { useUserStore } from "@/store/UseStore";


export function YuvakTable(props) {
  const {
    count,
    page,
    rows,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
  } = props;


  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(null);




const visibleRows = React.useMemo(
  () =>
   Object.values(rows).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    ),
  [ page, rowsPerPage, rows],
);

  const handleViewRole = (role) => {
    setSelectedRole(role);
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
                    <IconButton onClick={() => handleViewRole(yuvak.userAuth.id)}>
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
        </Box>
        <TablePagination
          rowsPerPageOptions={[25,50,75,100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Card>
      <RoleView
        open={openViewModal}
        setOpen={setOpenViewModal}
        role={selectedRole}
      />
    </>
  );
}