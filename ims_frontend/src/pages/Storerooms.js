import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  LocationOn,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

// PUBLIC_INTERFACE
export default function Storerooms() {
  const [storerooms, setStorerooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStoreroom, setEditingStoreroom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    capacity: '',
  });
  const { isManager } = useAuth();

  useEffect(() => {
    loadStorerooms();
  }, []);

  const loadStorerooms = async () => {
    try {
      const response = await apiService.getStorerooms();
      setStorerooms(response.data || []);
    } catch (err) {
      console.error('Error loading storerooms:', err);
      setError('Failed to load storerooms');
      // Set empty array for development
      setStorerooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (storeroom = null) => {
    setEditingStoreroom(storeroom);
    setFormData(storeroom || {
      name: '',
      location: '',
      description: '',
      capacity: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStoreroom(null);
    setFormData({
      name: '',
      location: '',
      description: '',
      capacity: '',
    });
  };

  const handleSave = async () => {
    try {
      if (editingStoreroom) {
        await apiService.updateStoreroom(editingStoreroom.id, formData);
      } else {
        await apiService.createStoreroom(formData);
      }
      await loadStorerooms();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving storeroom:', err);
      setError('Failed to save storeroom');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this storeroom?')) {
      try {
        await apiService.deleteStoreroom(id);
        await loadStorerooms();
      } catch (err) {
        console.error('Error deleting storeroom:', err);
        setError('Failed to delete storeroom');
      }
    }
  };

  const filteredStorerooms = storerooms.filter(storeroom =>
    storeroom.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    storeroom.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Storerooms</Typography>
        {isManager() && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Storeroom
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search storerooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Status</TableCell>
              {isManager() && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStorerooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isManager() ? 6 : 5} align="center">
                  No storerooms found
                </TableCell>
              </TableRow>
            ) : (
              filteredStorerooms.map((storeroom) => (
                <TableRow key={storeroom.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                      {storeroom.name}
                    </Box>
                  </TableCell>
                  <TableCell>{storeroom.location}</TableCell>
                  <TableCell>{storeroom.capacity || 'N/A'}</TableCell>
                  <TableCell>{storeroom.itemCount || 0}</TableCell>
                  <TableCell>
                    <Chip 
                      label="Active" 
                      color="success" 
                      size="small"
                    />
                  </TableCell>
                  {isManager() && (
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(storeroom)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(storeroom.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingStoreroom ? 'Edit Storeroom' : 'Add New Storeroom'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Capacity"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingStoreroom ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
