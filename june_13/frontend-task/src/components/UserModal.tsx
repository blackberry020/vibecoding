import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Link,
} from '@mui/material';
import { UserModalProps } from '../types';

const UserModal: React.FC<UserModalProps> = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">{user.name}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {user.username}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Phone: {user.phone}</Typography>
            <Typography>
              Website:{' '}
              <Link href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">
                {user.website}
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Address
            </Typography>
            <Typography>
              {user.address.street}, {user.address.suite}
            </Typography>
            <Typography>
              {user.address.city}, {user.address.zipcode}
            </Typography>
            <Typography>
              Location:{' '}
              <Link
                href={`https://www.google.com/maps?q=${user.address.geo.lat},${user.address.geo.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Map
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Typography>Name: {user.company.name}</Typography>
            <Typography>Catch Phrase: {user.company.catchPhrase}</Typography>
            <Typography>Business: {user.company.bs}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal; 