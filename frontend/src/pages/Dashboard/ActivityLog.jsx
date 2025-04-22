import React, { useState } from 'react';
import { Input, Button, List, message, DatePicker, Card, Col, Row } from 'antd';
import dayjs from 'dayjs';

const ActivityLog = () => {
  // Default activities
  const defaultActivities = new Array(10000).fill(null).map((_, index) => ({
    id: index + 1,
    description: `Activity #${index + 1}: Call with John about the contract update`,
    date: `2025-04-${21 + (index % 30)} 14:${(index % 60).toString().padStart(2, '0')}`,
    createdAt: `2025-04-${21 + (index % 30)} 12:00:00`,
  }));

  const [activities, setActivities] = useState(defaultActivities);
  const [activityDescription, setActivityDescription] = useState('');
  const [activityDate, setActivityDate] = useState(null);

  // Function to add an activity
  const addActivity = () => {
    if (!activityDescription || !activityDate) {
      message.error('Please provide activity description and date!');
      return;
    }

    const newActivity = {
      id: activities.length + 1,
      description: activityDescription,
      date: activityDate.format('YYYY-MM-DD HH:mm'),
      createdAt: new Date().toLocaleString(),
    };

    setActivities([...activities, newActivity]);
    setActivityDescription('');
    setActivityDate(null);
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl text-center text-gray-800 mb-8">Activity Log</h2>

      {/* Activity Input Card */}
      <Card className="bg-gray-100 p-6 rounded-xl mb-6">
        <Row gutter={16}>
          <Col span={18}>
            <Input
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              placeholder="Activity Description"
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Col>
          <Col span={4}>
            <DatePicker
              showTime
              value={activityDate ? dayjs(activityDate) : null}
              onChange={(date) => setActivityDate(date)}
              className="w-full py-2 px-4 border-2 border-gray-300 rounded-lg"
              placeholder="Select Date"
            />
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              onClick={addActivity}
              className="w-full h-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Activity Log List */}
      <Card className="bg-gray-50 p-6 rounded-xl">
        <List
          header={<div className="font-semibold text-lg text-gray-800">Recent Activities</div>}
          bordered
          dataSource={activities}
          renderItem={(activity) => (
            <List.Item className="p-4 mb-4 bg-white rounded-lg shadow-sm">
              <div className="text-gray-700">
                <strong>{activity.description}</strong>
                <div className="text-sm text-gray-500 mt-2">Date: {activity.date}</div>
                <div className="text-xs text-gray-400 mt-1">Logged at: {activity.createdAt}</div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ActivityLog;
