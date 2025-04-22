import React from 'react';
import { Layout } from 'antd';
import { Routes, Route } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import Sidebar from '../../components/Sidebar';
import Dashboard from './Dashboard';
import Leads from './Leads';
import Customers from './Customers';
import Meetings from './Meetings';
import Settings from './Settings';
import Employees from './Employees';
import Invoices from './Invoices';
import Quotations from './Quotations';
import TaskManagement from './TaskManagement';
import CallRecords from './CallRecords';
import SalesPipeline from './SalesPipeline';
import DocumentManagement from './DocumentManagement';
import ActivityLog from './ActivityLog';
import ProfilePage from './ProfilePage';
import FormBuilderWithKYC from './FormBuilderWithKYC';
import TemplateLayout from './TemplateLayout';

const { Content } = Layout;

const UniversalDashboard = ({ collapsed, setCollapsed }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
      <AppHeader />
      <Content style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/task-management" element={<TaskManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/call-records" element={<CallRecords />} />
          <Route path="/sales-pipeline" element={<SalesPipeline />} />
          <Route path="/document-management" element={<DocumentManagement />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/template" element={<TemplateLayout />} />
          <Route path="/form-builder" element={<FormBuilderWithKYC />} />
        </Routes>
      </Content>
    </Layout>
  </Layout>
);

export default UniversalDashboard;
