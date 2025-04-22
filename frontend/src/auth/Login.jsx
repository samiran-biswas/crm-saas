import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Add your login logic here
      messageApi.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      messageApi.error(error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 md:px-0">
        <Card
          className="w-full max-w-md rounded-2xl border border-gray-200 shadow-2xl bg-white"
          bodyStyle={{ padding: '2.5rem' }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-2">
              Sign in to access your CRM dashboard
            </p>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="you@example.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="••••••••"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>

            <div className="text-center text-sm text-gray-500">
              Don’t have an account?{' '}
              <Button
                type="link"
                onClick={() => navigate('/register')}
                className="p-0 text-blue-600 hover:text-blue-700"
              >
                Register
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Login;
