import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button } from '@mui/material';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import Login from './components/Login';
import Register from './components/Register';
import { User } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await api.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      // You might want to show an error message to the user here
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchUsers();
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    // Show success message or automatically log in
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setUsers([]);
  };

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            User Directory
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <UserTable
          users={users}
          onUserClick={handleUserClick}
          onDeleteUser={handleDeleteUser}
        />
        <UserModal
          user={selectedUser}
          open={!!selectedUser}
          onClose={handleCloseModal}
        />
      </Box>
    </Container>
  );
};

export default App;
