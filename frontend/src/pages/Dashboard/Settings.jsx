import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Switch, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';

// Import third-party APIs (simulated for now)
import { connectMailchimp, connectZapier, connectGoogleAnalytics, connectSlack, connectStripe, connectPaypal } from './thirdPartyIntegrations';

const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();
  const [integrationStatus, setIntegrationStatus] = useState({
    mailchimp: false,
    zapier: false,
    googleAnalytics: false,
    slack: false,
    stripe: false,
    paypal: false,
  });

  const onFinish = (values) => {
    console.log('Settings updated:', values);
    message.success('Settings updated successfully');
  };

  const handleCRMIntegration = (type) => {
    switch (type) {
      case 'mailchimp':
        connectMailchimp()
          .then(() => {
            setIntegrationStatus((prev) => ({ ...prev, mailchimp: true }));
            message.success('Mailchimp Integration Successful');
          })
          .catch(() => message.error('Mailchimp Integration Failed'));
        break;
      case 'zapier':
        connectZapier()
          .then(() => {
            setIntegrationStatus((prev) => ({ ...prev, zapier: true }));
            message.success('Zapier Integration Successful');
          })
          .catch(() => message.error('Zapier Integration Failed'));
        break;
      case 'googleAnalytics':
        connectGoogleAnalytics()
          .then(() => {
            setIntegrationStatus((prev) => ({ ...prev, googleAnalytics: true }));
            message.success('Google Analytics Integration Successful');
          })
          .catch(() => message.error('Google Analytics Integration Failed'));
        break;
      case 'slack':
        connectSlack()
          .then(() => {
            setIntegrationStatus((prev) => ({ ...prev, slack: true }));
            message.success('Slack Integration Successful');
          })
          .catch(() => message.error('Slack Integration Failed'));
        break;
      case 'stripe':
        connectStripe()
          .then(() => {
            setIntegrationStatus((prev) => ({ ...prev, stripe: true }));
            message.success('Stripe Integration Successful');
          })
          .catch(() => message.error('Stripe Integration Failed'));
        break;
      case 'paypal':
        connectPaypal()
          .then(() => {
            setIntegrationStatus((prev) => ({ ...prev, paypal: true }));
            message.success('PayPal Integration Successful');
          })
          .catch(() => message.error('PayPal Integration Failed'));
        break;
      default:
        break;
    }
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

      {/* CRM Integrations */}
      <Card title="CRM & Payment Gateway Integrations" className="mt-6">
        <Button
          type="primary"
          onClick={() => handleCRMIntegration('mailchimp')}
          disabled={integrationStatus.mailchimp}
        >
          {integrationStatus.mailchimp ? 'Mailchimp Connected' : 'Connect to Mailchimp'}
        </Button>
        <Button
          type="primary"
          onClick={() => handleCRMIntegration('zapier')}
          disabled={integrationStatus.zapier}
          className="ml-4"
        >
          {integrationStatus.zapier ? 'Zapier Connected' : 'Connect to Zapier'}
        </Button>
        <Button
          type="primary"
          onClick={() => handleCRMIntegration('googleAnalytics')}
          disabled={integrationStatus.googleAnalytics}
          className="ml-4"
        >
          {integrationStatus.googleAnalytics ? 'Google Analytics Connected' : 'Connect to Google Analytics'}
        </Button>
        <Button
          type="primary"
          onClick={() => handleCRMIntegration('slack')}
          disabled={integrationStatus.slack}
          className="ml-4"
        >
          {integrationStatus.slack ? 'Slack Connected' : 'Connect to Slack'}
        </Button>
        <Button
          type="primary"
          onClick={() => handleCRMIntegration('stripe')}
          disabled={integrationStatus.stripe}
          className="ml-4"
        >
          {integrationStatus.stripe ? 'Stripe Connected' : 'Connect to Stripe'}
        </Button>
        <Button
          type="primary"
          onClick={() => handleCRMIntegration('paypal')}
          disabled={integrationStatus.paypal}
          className="ml-4"
        >
          {integrationStatus.paypal ? 'PayPal Connected' : 'Connect to PayPal'}
        </Button>
      </Card>
    </div>
  );
};

export default Settings;


// import React from 'react';
// import { Card, Form, Input, Button, Select, Switch, message } from 'antd';
// import { UserOutlined, MailOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';

// const { Option } = Select;

// const Settings = () => {
//   const [form] = Form.useForm();

//   const onFinish = (values) => {
//     console.log('Settings updated:', values);
//     message.success('Settings updated successfully');
//   };

//   return (
//     <div className="space-y-6">
//       <Card title="Profile Settings">
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={onFinish}
//           initialValues={{
//             name: 'John Doe',
//             email: 'john@example.com',
//             timezone: 'UTC',
//             notifications: true,
//           }}
//         >
//           <Form.Item
//             name="name"
//             label="Full Name"
//             rules={[{ required: true, message: 'Please input your name!' }]}
//           >
//             <Input prefix={<UserOutlined />} />
//           </Form.Item>

//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[
//               { required: true, message: 'Please input your email!' },
//               { type: 'email', message: 'Please enter a valid email!' },
//             ]}
//           >
//             <Input prefix={<MailOutlined />} />
//           </Form.Item>

//           <Form.Item
//             name="timezone"
//             label="Timezone"
//             rules={[{ required: true, message: 'Please select your timezone!' }]}
//           >
//             <Select>
//               <Option value="UTC">UTC</Option>
//               <Option value="EST">Eastern Time (EST)</Option>
//               <Option value="PST">Pacific Time (PST)</Option>
//               <Option value="GMT">Greenwich Mean Time (GMT)</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="notifications"
//             label="Email Notifications"
//             valuePropName="checked"
//           >
//             <Switch />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Save Changes
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>

//       <Card title="Security Settings">
//         <Form layout="vertical">
//           <Form.Item
//             name="currentPassword"
//             label="Current Password"
//             rules={[{ required: true, message: 'Please input your current password!' }]}
//           >
//             <Input.Password prefix={<LockOutlined />} />
//           </Form.Item>

//           <Form.Item
//             name="newPassword"
//             label="New Password"
//             rules={[{ required: true, message: 'Please input your new password!' }]}
//           >
//             <Input.Password prefix={<LockOutlined />} />
//           </Form.Item>

//           <Form.Item
//             name="confirmPassword"
//             label="Confirm New Password"
//             dependencies={['newPassword']}
//             rules={[
//               { required: true, message: 'Please confirm your new password!' },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue('newPassword') === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(new Error('The two passwords do not match!'));
//                 },
//               }),
//             ]}
//           >
//             <Input.Password prefix={<LockOutlined />} />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" danger>
//               Change Password
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default Settings; 