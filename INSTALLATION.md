# Log Sentinel - Installation Guide

## Overview

Log Sentinel is a comprehensive Login Security Monitoring Dashboard built with Next.js (frontend) and Node.js/Express (backend) with MongoDB database.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 3. Database Configuration

#### Option A: Local MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### 4. Environment Variables

Edit `backend/.env` file:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/logsentinel

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Security Settings
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Log Analysis Settings
BRUTE_FORCE_THRESHOLD=5
BRUTE_FORCE_TIME_WINDOW=300000
SUSPICIOUS_IP_THRESHOLD=10
```

### 5. Start the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

#### Start Frontend Server
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Features

### Core Pages
- **Homepage** (`/`) - Product overview and features
- **Dashboard** (`/dashboard`) - Real-time security monitoring
- **Log Analyzer** (`/analyzer`) - Upload and analyze security logs
- **Alerts** (`/alerts`) - Security alerts and notifications
- **Reports** (`/reports`) - Security reports and recommendations

### Advanced Features
- **Attack Map** (`/attack-map`) - Geographic attack visualization
- **Password Strength Checker** (`/password-strength`) - Password analysis tool

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/timeline` - Login activity timeline
- `GET /api/dashboard/suspicious-ips` - Suspicious IP addresses

### Logs
- `GET /api/logs` - Get login attempts
- `POST /api/logs/upload` - Upload log files
- `POST /api/logs/submit` - Submit logs manually
- `GET /api/logs/stats` - Log statistics

### Alerts
- `GET /api/alerts` - Get security alerts
- `GET /api/alerts/stats` - Alert statistics
- `PATCH /api/alerts/:id/resolve` - Mark alert as resolved
- `POST /api/alerts` - Create new alert

### Reports
- `GET /api/reports/security` - Generate security report

### Log Analysis
- `POST /api/analyze` - Analyze log entries

## Sample Data

The application includes sample data for demonstration. You can also:

1. Upload your own log files in the Log Analyzer
2. Use the sample data provided in the analyzer
3. Generate test data using the backend APIs

## Security Features

- **Rate Limiting** - Prevents API abuse
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Prevents injection attacks
- **GeoIP Tracking** - Geographic IP analysis

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   ```

3. **Dependency Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Tailwind CSS Not Working**
   - Ensure PostCSS is configured
   - Check Tailwind config file
   - Restart development server

## Production Deployment

### Environment Setup
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-string
JWT_SECRET=your-production-jwt-secret
```

### Build Commands
```bash
# Frontend
cd frontend
npm run build

# Backend (use PM2 for process management)
npm install -g pm2
pm2 start server.js --name "log-sentinel"
```

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the console for error messages
4. Verify environment variables are correctly set

## License

This project is licensed under the MIT License.
