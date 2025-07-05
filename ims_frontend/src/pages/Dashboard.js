import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Inventory,
  Store,
  SwapHoriz,
  TrendingUp,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';

// PUBLIC_INTERFACE
export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Since we don't have a dashboard endpoint, let's fetch basic data
      const [itemsResponse, storeroomsResponse, transfersResponse] = await Promise.all([
        apiService.getItems(),
        apiService.getStorerooms(),
        apiService.getTransfers(),
      ]);

      setDashboardData({
        totalItems: itemsResponse.data?.length || 0,
        totalStorerooms: storeroomsResponse.data?.length || 0,
        totalTransfers: transfersResponse.data?.length || 0,
        lowStockItems: itemsResponse.data?.filter(item => item.quantity < 10)?.length || 0,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
      // Set default values for development
      setDashboardData({
        totalItems: 0,
        totalStorerooms: 0,
        totalTransfers: 0,
        lowStockItems: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const cards = [
    {
      title: 'Total Items',
      value: dashboardData?.totalItems || 0,
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: '#7fb8f0',
    },
    {
      title: 'Storerooms',
      value: dashboardData?.totalStorerooms || 0,
      icon: <Store sx={{ fontSize: 40 }} />,
      color: '#424242',
    },
    {
      title: 'Transfers',
      value: dashboardData?.totalTransfers || 0,
      icon: <SwapHoriz sx={{ fontSize: 40 }} />,
      color: '#fddeaf',
    },
    {
      title: 'Low Stock Items',
      value: dashboardData?.lowStockItems || 0,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#f44336',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="h2">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="textSecondary">
                No recent activity to display.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Typography variant="body2" color="textSecondary">
                All systems operational.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
