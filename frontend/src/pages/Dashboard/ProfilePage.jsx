import React from 'react';
import { Card, Avatar, Tabs, Descriptions, Timeline, Button } from 'antd';

const { TabPane } = Tabs;

const user = {
  name: 'Samiran Biswas',
  role: 'CRM Admin',
  email: 'samiran@example.com',
  phone: '+91 9851215184',
  location: 'Noida Sector 2, India',
  avatar: 'https://i.pravatar.cc/150?img=5',
  activity: [
    { time: '2025-04-22 10:00 AM', content: 'Logged in' },
    { time: '2025-04-22 10:30 AM', content: 'Updated a customer profile' },
    { time: '2025-04-22 11:00 AM', content: 'Assigned a new lead to John Doe' },
  ],
};

const ProfilePage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">User Profile</h1>
      <Card className="rounded-lg shadow-lg border border-gray-200 bg-white">
        <div className="flex items-center space-x-6 mb-6">
          <Avatar size={100} src={user.avatar} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.role}</p>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
            <p className="text-gray-600">{user.location}</p>
          </div>
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Overview" key="1">
            <Descriptions title="Profile Details" bordered column={1}>
              <Descriptions.Item label="Full Name">{user.name}</Descriptions.Item>
              <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="Location">{user.location}</Descriptions.Item>
            </Descriptions>
          </TabPane>

          <TabPane tab="Activity Logs" key="2">
            <Timeline>
              {user.activity.map((item, index) => (
                <Timeline.Item key={index}>
                  {item.content} <span className="text-gray-500 text-sm">({item.time})</span>
                </Timeline.Item>
              ))}
            </Timeline>
          </TabPane>

          <TabPane tab="Settings" key="3">
            <p className="text-gray-600">You can integrate editable settings here.</p>
            <Button type="primary" className="mt-4">Edit Profile</Button>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfilePage;
