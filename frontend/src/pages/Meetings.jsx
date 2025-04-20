import React, { useState } from 'react';
import { Card, Button, Table, Tag, Modal, Form, Input, Select, DatePicker, TimePicker, message } from 'antd';
import { PlusOutlined, CalendarOutlined, UserOutlined, VideoCameraOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Meetings = () => {
  const [meetings, setMeetings] = useState([
    {
      id: '1',
      title: 'Project Kickoff',
      type: 'virtual',
      startTime: '2024-03-15 10:00',
      endTime: '2024-03-15 11:00',
      location: 'Zoom Meeting',
      status: 'scheduled',
      organizer: 'John Doe',
      participants: ['Jane Smith', 'Mike Johnson']
    },
    {
      id: '2',
      title: 'Client Review',
      type: 'in_person',
      startTime: '2024-03-16 14:00',
      endTime: '2024-03-16 15:30',
      location: 'Conference Room A',
      status: 'scheduled',
      organizer: 'Jane Smith',
      participants: ['John Doe', 'Sarah Wilson']
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'virtual' ? 'blue' : type === 'in_person' ? 'green' : 'orange'}>
          {type === 'virtual' ? <VideoCameraOutlined /> : type === 'in_person' ? <UserOutlined /> : <PhoneOutlined />}
          {type}
        </Tag>
      ),
    },
    {
      title: 'Date & Time',
      key: 'time',
      render: (_, record) => (
        <div>
          <div>{new Date(record.startTime).toLocaleDateString()}</div>
          <div className="text-gray-500">
            {new Date(record.startTime).toLocaleTimeString()} - {new Date(record.endTime).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'scheduled' ? 'blue' : status === 'completed' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Organizer',
      dataIndex: 'organizer',
      key: 'organizer',
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
      render: (participants) => (
        <div className="flex flex-wrap gap-1">
          {participants.map((participant, index) => (
            <Tag key={index}>{participant}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewMeeting(record.id)}>
          View Details
        </Button>
      ),
    },
  ];

  const handleAddMeeting = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const [startTime, endTime] = values.time;
      const newMeeting = {
        id: Date.now().toString(),
        title: values.title,
        type: values.type,
        startTime: startTime.format('YYYY-MM-DD HH:mm'),
        endTime: endTime.format('YYYY-MM-DD HH:mm'),
        location: values.location,
        status: 'scheduled',
        organizer: 'Current User', // This should come from the actual user
        participants: values.participants || []
      };

      setMeetings([...meetings, newMeeting]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Meeting created successfully');
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleViewMeeting = (id) => {
    // Navigate to meeting details page
    navigate(`/meetings/${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMeeting}>
          Schedule Meeting
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={meetings}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Schedule New Meeting"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the meeting title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Meeting Type"
            rules={[{ required: true, message: 'Please select meeting type!' }]}
          >
            <Select>
              <Option value="virtual">Virtual</Option>
              <Option value="in_person">In Person</Option>
              <Option value="phone">Phone Call</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="time"
            label="Date & Time"
            rules={[{ required: true, message: 'Please select meeting time!' }]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please input the meeting location!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="participants"
            label="Participants"
          >
            <Select mode="multiple" placeholder="Select participants">
              <Option value="John Doe">John Doe</Option>
              <Option value="Jane Smith">Jane Smith</Option>
              <Option value="Mike Johnson">Mike Johnson</Option>
              <Option value="Sarah Wilson">Sarah Wilson</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Meetings; 