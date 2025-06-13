import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserTableProps } from '../types';

const UserTable: React.FC<UserTableProps> = ({ users, onUserClick, onDeleteUser }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name/Email</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Website</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              hover
              onClick={() => onUserClick(user)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Typography variant="subtitle2">{user.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.email}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {user.address.street}, {user.address.suite}
                </Typography>
                <Typography variant="body2">
                  {user.address.city}, {user.address.zipcode}
                </Typography>
              </TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.website}
                </a>
              </TableCell>
              <TableCell>{user.company.name}</TableCell>
              <TableCell>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteUser(user.id);
                  }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable; 