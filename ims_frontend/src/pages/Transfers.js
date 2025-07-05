import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  SwapHoriz,
  Send,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

// PUBLIC_INTERFACE
export default function Transfers() {
  const [items, setItems] = useState([]);
  const [storerooms, setStorerooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    itemId: '',
    sourceStoreroomId: '',
    destinationStoreroomId: '',
    quantity: '',
    notes: '',
  });
  const { isManager } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsResponse, storeroomsResponse] = await Promise.all([
        apiService.getItems(),
        apiService.getStorerooms(),
      ]);
      
      setItems(itemsResponse.data || []);
      setStorerooms(storeroomsResponse.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
      // Set empty arrays for development
      setItems([]);
      setStorerooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await apiService.createTransfer(formData);
      setSuccess('Transfer created successfully!');
      setFormData({
        itemId: '',
        sourceStoreroomId: '',
        destinationStoreroomId: '',
        quantity: '',
        notes: '',
      });
    } catch (err) {
      console.error('Error creating transfer:', err);
      setError('Failed to create transfer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!isManager()) {
    return (
      <Alert severity="warning">
        You don't have permission to create transfers. Only managers and admins can perform this action.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create Transfer
      </Typography>
      
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Transfer items between storerooms
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Item</InputLabel>
                      <Select
                        value={formData.itemId}
                        onChange={(e) => handleInputChange('itemId', e.target.value)}
                        required
                      >
                        {items.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name} ({item.sku})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      required
                      inputProps={{ min: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Source Storeroom</InputLabel>
                      <Select
                        value={formData.sourceStoreroomId}
                        onChange={(e) => handleInputChange('sourceStoreroomId', e.target.value)}
                        required
                      >
                        {storerooms.map((storeroom) => (
                          <MenuItem key={storeroom.id} value={storeroom.id}>
                            {storeroom.name} - {storeroom.location}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Destination Storeroom</InputLabel>
                      <Select
                        value={formData.destinationStoreroomId}
                        onChange={(e) => handleInputChange('destinationStoreroomId', e.target.value)}
                        required
                      >
                        {storerooms.map((storeroom) => (
                          <MenuItem 
                            key={storeroom.id} 
                            value={storeroom.id}
                            disabled={storeroom.id === formData.sourceStoreroomId}
                          >
                            {storeroom.name} - {storeroom.location}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes (Optional)"
                      multiline
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Add any additional notes about this transfer..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
                    >
                      {submitting ? 'Creating Transfer...' : 'Create Transfer'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <SwapHoriz sx={{ mr: 1, verticalAlign: 'middle' }} />
                Transfer Summary
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Item: {formData.itemId ? items.find(i => i.id === formData.itemId)?.name : 'Not selected'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Quantity: {formData.quantity || 'Not specified'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  From: {formData.sourceStoreroomId ? storerooms.find(s => s.id === formData.sourceStoreroomId)?.name : 'Not selected'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  To: {formData.destinationStoreroomId ? storerooms.find(s => s.id === formData.destinationStoreroomId)?.name : 'Not selected'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
