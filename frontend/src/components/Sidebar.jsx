import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileDoneOutlined,
  SettingOutlined,
  CalendarOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
  PhoneOutlined,
  FormOutlined,
  TagsOutlined,
  FileAddOutlined,
  PhoneFilled,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/leads',
      icon: <TagsOutlined />,
      label: 'Leads',
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: 'Customers',
    },
    {
      key: '/employees',
      icon: <TeamOutlined />,
      label: 'Employees',
    },
    {
      key: '/invoices',
      icon: <FileTextOutlined />,
      label: 'Invoices',
    },
    {
      key: '/quotations',
      icon: <FileAddOutlined />,
      label: 'Quotations',
    },
    {
      key: '/call-records',
      icon: <PhoneFilled />,
      label: 'Call Records',
    },
    {
      key: '/lead-forms',
      icon: <FormOutlined />,
      label: 'Lead Form Generator',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.key === '/settings' || item.key === '/employees') {
      return user?.role === 'ADMIN';
    }
    return true;
  });

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        background: token.colorBgContainer,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 1000
      }}
      breakpoint="lg"
      collapsedWidth={80}
    >
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{ height: '64px' }}
      >
        {!collapsed && (
          <h1 className="text-xl font-bold text-primary m-0">CRM SaaS</h1>
        )}
        {collapsed && (
          <h1 className="text-xl font-bold text-primary m-0">CRM</h1>
        )}
        <div 
          className="cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <MenuUnfoldOutlined style={{ fontSize: '18px' }} />
          ) : (
            <MenuFoldOutlined style={{ fontSize: '18px' }} />
          )}
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={filteredMenuItems}
        onClick={({ key }) => navigate(key)}
        style={{
          borderRight: 'none',
          padding: '8px 0',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto'
        }}
        theme="light"
      />
    </Sider>
  );
};

export default Sidebar; 