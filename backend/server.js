require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const { errorHandler } = require('./utils/errorHandler');

// Import routes
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const leadRoutes = require('./routes/leadRoutes');
const customerRoutes = require('./routes/customerRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const taskRoutes = require('./routes/taskRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined');
  process.exit(1);
}

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/projects', projectRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 