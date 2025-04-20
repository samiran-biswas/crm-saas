import React from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo" style={{ fontSize: '20px', fontWeight: 'bold' }}>
        CRM SaaS
      </div>
      <Dropdown overlay={menu} placement="bottomRight">
        <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
      </Dropdown>
    </Header>
  );
};

export default Navbar; 