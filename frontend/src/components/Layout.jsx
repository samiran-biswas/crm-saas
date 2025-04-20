import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  MessageOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/leads',
      icon: <UserOutlined />,
      label: 'Leads',
    },
    {
      key: '/customers',
      icon: <TeamOutlined />,
      label: 'Customers',
    },
    {
      key: '/tickets',
      icon: <MessageOutlined />,
      label: 'Tickets',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => {
          dispatch(logout());
          navigate('/login');
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="h-8 m-4 bg-white rounded" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="flex items-center justify-between bg-white px-6">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-16 h-16"
          />
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div className="flex items-center cursor-pointer">
              <Avatar
                className="bg-blue-500"
                icon={<UserOutlined />}
              />
              <span className="ml-2">{user?.name}</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 