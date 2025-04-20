import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import AppHeader from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Customers from './pages/Customers';
import Tickets from './pages/Tickets';
import Tasks from './pages/Tasks';
import Meetings from './pages/Meetings';
import Settings from './pages/Settings';

const { Content } = Layout;

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {isAuthenticated && <Sidebar />}
        <Layout style={{ marginLeft: isAuthenticated ? 250 : 0 }}>
          {isAuthenticated && <AppHeader />}
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/meetings" element={<Meetings />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App; 