import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  TeamOutlined, 
  FileTextOutlined, 
  SettingOutlined, 
  FileSearchOutlined, 
  FileDoneOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BranchesOutlined, 
  CalendarOutlined,
  PhoneOutlined,
  FileAddOutlined,
  FileSyncOutlined,
  FileOutlined,
  BuildOutlined, // NEW: Icon for Form Builder
} from '@ant-design/icons';  
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const user = { role: 'ADMIN' }; // Replace with dynamic role

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/leads', icon: <FileTextOutlined />, label: 'Leads' },
    { key: '/customers', icon: <UserOutlined />, label: 'Customers' },
    { key: '/employees', icon: <TeamOutlined />, label: 'Employees' },
    { key: '/quotations', icon: <FileSearchOutlined />, label: 'Quotations' },
    { key: '/invoices', icon: <FileDoneOutlined />, label: 'Invoices' },
    { key: '/task-management', icon: <BranchesOutlined />, label: 'Task Management' },
    { key: '/meetings', icon: <CalendarOutlined />, label: 'Meetings' },
    { key: '/call-records', icon: <PhoneOutlined />, label: 'Call Records' },
    { key: '/sales-pipeline', icon: <BranchesOutlined />, label: 'Sales Pipeline' },
    { key: '/document-management', icon: <FileAddOutlined />, label: 'Document Management' },
    { key: '/form-builder', icon: <BuildOutlined />, label: 'Form Builder' }, // 👉 New item added
    { key: '/activity-log', icon: <FileSyncOutlined />, label: 'Activity Log' },
    { key: '/template', icon: <FileOutlined />, label: 'Template Design' }, // NEW: Template Design item added

    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    (item.key === '/settings' || item.key === '/employees' || item.key === '/task-management') 
    ? user?.role === 'ADMIN' 
    : true
  );

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        background: '#001529',
        color: 'white',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 1000,
      }}
      breakpoint="lg"
      collapsedWidth={80}
    >
      <div style={{ height: '64px', textAlign: 'center', color: 'white', padding: '10px 0' }}>
        {!collapsed ? 'CRM SaaS' : 'CRM'}
      </div>
      <div onClick={() => setCollapsed(!collapsed)} style={{ cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={filteredMenuItems}
        onClick={({ key }) => navigate(key)}
        style={{
          borderRight: 'none',
          padding: '16px 0',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}
        theme="dark"
      />
    </Sider>
  );
};

export default Sidebar;
