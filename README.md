# CRM SaaS Application

A modern CRM (Customer Relationship Management) SaaS application built with MERN stack.

## Features

### Basic Features
- User Authentication & Authorization
  - Sign up, login, password reset
  - Multi-factor authentication (MFA)
  - User profile management
- CRM Dashboard
  - View leads, customers, opportunities
  - Task and meeting management
- Lead Management
  - Create, update, and delete leads
  - Track lead status and interactions
- Customer Management
  - Manage customer information
  - Custom tags and categories
- Ticket/Support System
  - Create and assign support tickets
  - Track ticket status
- Subscription Management
  - Different subscription plans
  - Feature access control
- Analytics & Reports
  - Sales and performance reports
  - Dashboard metrics
- Custom Roles & Permissions
  - Role-based access control
  - Subscription-based permissions

### Advanced Features
- Third-Party Integrations
  - Slack notifications
  - Zoho CRM sync
- Email Integration
  - Email templates
  - Automated follow-ups
- Calendar Integration
  - Meeting scheduling
  - Google Calendar/Outlook sync
- Advanced Analytics
  - Sales forecasting
  - Real-time dashboard
- Workflow Automation
  - Lead nurturing
  - Task reminders

## Tech Stack

- Frontend:
  - React (Vite)
  - Ant Design
  - Tailwind CSS
  - Redux Toolkit
- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
- Development Tools:
  - Git
  - ESLint
  - Prettier

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd crm-saas
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

# Frontend (.env)
VITE_API_URL=http://localhost:5000
```

4. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm run dev
```

## Project Structure

```
/crm-saas
├── /backend
│   ├── /controllers
│   ├── /models
│   ├── /routes
│   ├── /utils
│   ├── /services
│   └── /config
├── /frontend
│   ├── /src
│   │   ├── /components
│   │   ├── /pages
│   │   ├── /redux
│   │   ├── /services
│   │   └── /styles
│   └── /public
└── /scripts
```

## License

This project is licensed under the MIT License. # crm-saas
