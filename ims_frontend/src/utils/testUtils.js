import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from '../contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7fb8f0',
    },
    secondary: {
      main: '#424242',
    },
  },
});

// PUBLIC_INTERFACE
export function renderWithProviders(ui, options = {}) {
  /**
   * Custom render function that includes all necessary providers
   * for testing components that depend on context or routing
   */
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

// Mock API service for testing
export const mockApiService = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  setAuthToken: jest.fn(),
  getItems: jest.fn(),
  createItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn(),
  getStorerooms: jest.fn(),
  createStoreroom: jest.fn(),
  updateStoreroom: jest.fn(),
  deleteStoreroom: jest.fn(),
  getTransfers: jest.fn(),
  createTransfer: jest.fn(),
  getTransferHistory: jest.fn(),
  getDashboardData: jest.fn(),
  login: jest.fn(),
  getCurrentUser: jest.fn(),
};

// Mock user data for testing
export const mockUsers = {
  admin: {
    id: 1,
    username: 'admin',
    role: 'admin',
    email: 'admin@example.com',
  },
  manager: {
    id: 2,
    username: 'manager',
    role: 'manager',
    email: 'manager@example.com',
  },
  user: {
    id: 3,
    username: 'user',
    role: 'user',
    email: 'user@example.com',
  },
};

// Mock data for testing
export const mockData = {
  items: [
    {
      id: 1,
      name: 'Test Item 1',
      sku: 'SKU001',
      category: 'Electronics',
      price: 99.99,
      description: 'Test item description',
    },
    {
      id: 2,
      name: 'Test Item 2',
      sku: 'SKU002',
      category: 'Office',
      price: 29.99,
      description: 'Another test item',
    },
  ],
  storerooms: [
    {
      id: 1,
      name: 'Warehouse A',
      location: 'Building 1',
      capacity: 1000,
      description: 'Main warehouse',
    },
    {
      id: 2,
      name: 'Warehouse B',
      location: 'Building 2',
      capacity: 500,
      description: 'Secondary warehouse',
    },
  ],
  transfers: [
    {
      id: 1,
      itemId: 1,
      itemName: 'Test Item 1',
      quantity: 10,
      sourceStoreroomId: 1,
      sourceStoreroomName: 'Warehouse A',
      destinationStoreroomId: 2,
      destinationStoreroomName: 'Warehouse B',
      status: 'completed',
      createdAt: '2023-01-01T10:00:00Z',
      createdBy: 'admin',
      notes: 'Test transfer',
    },
  ],
};
