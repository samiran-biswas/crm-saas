import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      // Registration logic here
      // Example: Simulate a successful registration
      setLoading(false);
      message.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 md:px-0">
      {contextHolder}
      <Card
        className="w-full max-w-md rounded-2xl border border-gray-200 shadow-2xl bg-white"
        bodyStyle={{ padding: '2.5rem' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create an Account</h1>
          <p className="text-gray-500 text-sm mt-2">Fill out the form to register</p>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="John Doe"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="you@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
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
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base"
              size="large"
              loading={loading}
            >
              Register
            </Button>
          </Form.Item>

          <div className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Button
              type="link"
              onClick={() => navigate('/login')}
              className="p-0 text-blue-600 hover:text-blue-700"
            >
              Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
