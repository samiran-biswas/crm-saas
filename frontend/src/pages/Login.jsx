import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await dispatch(login(values)).unwrap();
      messageApi.success('Login successful!');
      navigate('/');
    } catch (error) {
      messageApi.error(error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {contextHolder}
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>

          <div className="text-center">
            Don't have an account?{' '}
            <Button type="link" onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 