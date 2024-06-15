'use client';

import * as React from 'react';
import {
  Box,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "./../../scrollbar";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { RoleView } from '@/components/dashboard/role/roleView';
import { RoleEdit } from '@/components/dashboard/role/roleEdit';
import { useUserStore } from "@/store/useStore";
import SearchIcon from '@mui/icons-material/Search';
import _ from 'lodash';

export const RoleTable = (props) => {
  const {
    count,
    page,
    rows,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
  } = props;

  const [searchTerm, setSearchTerm] = React.useState("");
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(null);

  const handleViewRole = (role) => {
    setSelectedRole(role);
    setOpenViewModal(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setOpenEditModal(true);
  };

  const deleteRole = useUserStore((state) => state.deleteRole);

  const handleDeleteRole = (roleId) => {
    deleteRole(roleId);
  };

  let data = rows;

  if (searchTerm !== "") {
    data = _.filter(data, (i) => {
      return i.name && i.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  data = applyPagination(data, page, rowsPerPage);

  return (
    <>
      <Card sx={{ p: 2 }}>
        <OutlinedInput
          defaultValue=""
          fullWidth
          placeholder="Search Role"
          onChange={(e) => setSearchTerm(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <SearchIcon />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: 500 }}
        />
      </Card>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr No.</TableCell>
                  <TableCell>Sabha Name</TableCell>
                  <TableCell>Sabha Day</TableCell>
                  <TableCell>Sabha Location</TableCell>
                  <TableCell>Sabha Type</TableCell>
                  <TableCell>Sabha Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((role, index) => (
                  <TableRow key={role.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.day}</TableCell>
                    <TableCell>{role.location}</TableCell>
                    <TableCell>{role.sabhaType}</TableCell>
                    <TableCell>{role.time}</TableCell>
                    <TableCell>
                      <Chip
                        label={role.status}
                        sx={
                          role.status === "Active"
                            ? { bgcolor: "green", color: "white" }
                            : { bgcolor: "red", color: "white" }
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewRole(role)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditRole(role)}>
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
        </Scrollbar>
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
      <RoleEdit
        open={openEditModal}
        setOpen={setOpenEditModal}
        role={selectedRole}
      />
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
