# Inventory Management System - Frontend

A modern React-based inventory management system with role-based access control, real-time updates, and responsive design.

## Features

- **Authentication & Authorization**: JWT-based login with role-based permissions (Admin, Manager)
- **Dashboard**: Overview of inventory statistics and system status
- **Item Management**: Complete CRUD operations for inventory items
- **Storeroom Management**: Manage multiple storage locations
- **Transfer System**: Move items between storerooms with history tracking
- **Search & Filter**: Advanced search capabilities across all entities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Material UI**: Modern, accessible user interface components

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Material-UI**: Professional UI component library
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **Context API**: State management for authentication

## Color Scheme

- **Primary**: #7fb8f0 (Light Blue)
- **Secondary**: #424242 (Dark Gray)
- **Accent**: #fddeaf (Light Peach)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout with sidebar and header
│   └── ProtectedRoute.js # Authentication guard component
├── contexts/           # React Context providers
│   └── AuthContext.js  # Authentication state management
├── pages/             # Main application pages
│   ├── Dashboard.js   # Dashboard with statistics
│   ├── Items.js       # Item management page
│   ├── Login.js       # Authentication page
│   ├── Storerooms.js  # Storeroom management page
│   ├── Transfers.js   # Transfer creation page
│   └── TransferHistory.js # Transfer history page
├── services/          # API service layer
│   └── apiService.js  # HTTP client and API methods
├── App.js            # Main application component
├── App.css           # Global styles and theme
└── index.js          # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your backend API URL.

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## API Integration

The frontend communicates with the backend through RESTful API endpoints:

- `/auth/login` - User authentication
- `/auth/me` - Get current user profile
- `/api/items` - Item management
- `/api/storerooms` - Storeroom management
- `/api/transfers` - Transfer operations
- `/api/transfer-history` - Transfer history

## User Roles

- **Admin**: Full access to all features and user management
- **Manager**: Access to inventory management and transfers
- **User**: Read-only access to inventory data

## Features by Role

### Admin
- All manager permissions
- User management
- System configuration
- Full CRUD operations

### Manager
- Create, edit, and delete items
- Manage storerooms
- Create and approve transfers
- View all reports and history

### User
- View inventory items
- View storeroom information
- View transfer history
- Search and filter data

## Development

### Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

### Code Style

The project uses ESLint for code linting and follows React best practices:

- Functional components with hooks
- Proper prop types and validation
- Consistent naming conventions
- Responsive design principles

### Testing

Run the test suite:
```bash
npm test
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## Deployment

The application can be deployed to any static hosting service:

- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## Environment Variables

- `REACT_APP_API_URL`: Backend API base URL
- `REACT_APP_NAME`: Application name
- `REACT_APP_VERSION`: Application version

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.
