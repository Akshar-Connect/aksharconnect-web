'use client';

import * as React from 'react';
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { RoleView } from '@/components/dashboard/role/roleView';
import { useUserStore } from "@/store/useStore";

export const YuvakTable = (props) => {
  const {
    count,
    page,
    rows,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
  } = props;

  // console.log("Rows: ", rows); // Debugging: log the rows to verify the data

  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(null);

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
                <TableCell>Sr No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Sabha Type</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((role, index) => (
                <TableRow key={role.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.day}</TableCell>
                  <TableCell>{role.location}</TableCell>
                  <TableCell>{role.sabhaType}</TableCell>
                  <TableCell>{role.time}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewRole(role)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRole(role.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <RoleView
        open={openViewModal}
        setOpen={setOpenViewModal}
        role={selectedRole}
      />
    </>
  );
};

function applyPagination(rows, page, rowsPerPage) {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
