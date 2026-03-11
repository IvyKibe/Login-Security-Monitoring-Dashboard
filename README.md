# Log Sentinel - Login Security Monitoring Dashboard

Intelligent Login Security Monitoring and Threat Detection

## Overview

Log Sentinel is a comprehensive cybersecurity dashboard focused on login security monitoring. Think of it as a mini Splunk or Security Onion specifically designed to detect and analyze login-based cyber attacks.

## Features

- **Real-time Login Monitoring**: Track login attempts, failed logins, and suspicious activities
- **Brute Force Detection**: Automatically detect potential brute force attacks
- **IP Analysis**: Identify suspicious IP addresses and patterns
- **Log Analysis Engine**: Analyze uploaded logs for security threats
- **Security Alerts**: Real-time notifications of potential threats
- **Security Reports**: Generate comprehensive security reports with recommendations
- **Attack Visualization**: Geographic mapping of attack sources

## Technology Stack

### Frontend
- React with Next.js
- Tailwind CSS for styling
- Chart.js for data visualization

### Backend
- Node.js with Express.js
- MongoDB for data storage
- Log parsing and analysis engine

### Security Features
- IP detection and geolocation
- Rate limiting
- Pattern recognition for attack detection
- Password strength analysis

## Project Structure

```
logsentinel/
├── frontend/          # Next.js frontend application
│   ├── pages/        # React pages
│   ├── components/   # Reusable components
│   └── dashboard/    # Dashboard-specific components
├── backend/          # Node.js backend API
│   ├── routes/       # API routes
│   ├── controllers/  # Request handlers
│   ├── models/       # MongoDB models
│   ├── logAnalyzer.js # Log analysis engine
│   └── alerts.js     # Alert management
└── database/         # Database configuration
```

## Getting Started

1. Install dependencies for both frontend and backend
2. Set up MongoDB database
3. Configure environment variables
4. Start the development servers

## Advanced Features

- Attack heat map visualization
- AI-powered log analysis
- Password strength checker
- Brute force attack simulator
- Geographic IP tracking

## License

This project is licensed under the MIT License.
