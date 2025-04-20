import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../store/slices/authSlice';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const resultAction = await dispatch(register(values));
      if (register.fulfilled.match(resultAction)) {
        message.success('Registration successful!');
        navigate('/login');
      } else {
        message.error(resultAction.payload?.msg || 'Registration failed');
      }
    } catch (error) {
      message.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {contextHolder}
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
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
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            Already have an account?{' '}
            <Button type="link" onClick={() => navigate('/login')}>
              Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 