import React from 'react';
import { Layout, Dropdown, Space, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const items = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Header style={{ 
      background: '#fff', 
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1,
    }}>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} />
          <span>Admin</span>
        </Space>
      </Dropdown>
    </Header>
  );
};

export default AppHeader; 