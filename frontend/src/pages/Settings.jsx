import React from 'react';
import { Card, Form, Input, Button, Select, Switch, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';

const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Settings updated:', values);
    message.success('Settings updated successfully');
  };

  return (
    <div className="space-y-6">
      <Card title="Profile Settings">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: 'John Doe',
            email: 'john@example.com',
            timezone: 'UTC',
            notifications: true,
          }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="timezone"
            label="Timezone"
            rules={[{ required: true, message: 'Please select your timezone!' }]}
          >
            <Select>
              <Option value="UTC">UTC</Option>
              <Option value="EST">Eastern Time (EST)</Option>
              <Option value="PST">Pacific Time (PST)</Option>
              <Option value="GMT">Greenwich Mean Time (GMT)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notifications"
            label="Email Notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Security Settings">
        <Form layout="vertical">
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please input your current password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: 'Please input your new password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" danger>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 