import React, { useState } from 'react';
import { Card, Button, Table, Tag, Modal, Form, Input, Select, DatePicker, message, Calendar, Tabs } from 'antd';
import { PlusOutlined, VideoCameraOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Meetings = () => {
  const [meetings, setMeetings] = useState([
    {
      id: '1',
      title: 'Project Kickoff',
      type: 'virtual',
      startTime: '2025-04-15 10:00',
      endTime: '2025-04-15 11:00',
      location: 'Zoom Meeting',
      status: 'scheduled',
      organizer: 'John Doe',
      participants: ['Jane Smith', 'Mike Johnson'],
      priority: 'High', // Added priority
    },
    {
      id: '2',
      title: 'Client Review',
      type: 'in_person',
      startTime: '2025-04-16 14:00',
      endTime: '2025-04-16 15:30',
      location: 'Conference Room A',
      status: 'scheduled',
      organizer: 'Jane Smith',
      participants: ['John Doe', 'Sarah Wilson'],
      priority: 'Medium', // Added priority
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState('table');

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
        <>
          <Button type="link" onClick={() => handleViewMeeting(record)}>
            View Details
          </Button>
          <Button type="link" onClick={() => handleEditMeeting(record)} style={{ color: 'orange' }}>
            Edit
          </Button>
        </>
      ),
    },
  ];

  const handleAddMeeting = () => {
    setCurrentMeeting(null); // Reset for new meeting
    setIsModalVisible(true);
  };

  const handleEditMeeting = (meeting) => {
    setCurrentMeeting(meeting);
    form.setFieldsValue({
      title: meeting.title,
      type: meeting.type,
      time: [dayjs(meeting.startTime), dayjs(meeting.endTime)],
      location: meeting.location,
      description: meeting.description,
      participants: meeting.participants,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const [startTime, endTime] = values.time;
      const newMeeting = {
        id: currentMeeting ? currentMeeting.id : Date.now().toString(),
        title: values.title,
        type: values.type,
        startTime: startTime.format('YYYY-MM-DD HH:mm'),
        endTime: endTime.format('YYYY-MM-DD HH:mm'),
        location: values.location,
        status: 'scheduled',
        organizer: 'Current User',
        participants: values.participants || [],
        priority: values.priority || 'Medium', // Set priority
      };

      if (currentMeeting) {
        const updatedMeetings = meetings.map(meeting =>
          meeting.id === currentMeeting.id ? newMeeting : meeting
        );
        setMeetings(updatedMeetings);
      } else {
        setMeetings([...meetings, newMeeting]);
      }

      setIsModalVisible(false);
      form.resetFields();
      message.success(currentMeeting ? 'Meeting updated successfully' : 'Meeting created successfully');
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleViewMeeting = (meeting) => {
    setCurrentMeeting(meeting);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
  };

  const handleCalendarClick = (date) => {
    setCurrentMeeting(null);
    form.setFieldsValue({ time: [date, date] });
    setIsModalVisible(true);
  };

  const dateCellRender = (date) => {
    const meetingsOnThisDay = meetings.filter(meeting => dayjs(meeting.startTime).isSame(date, 'day'));
    return meetingsOnThisDay.length > 0 ? (
      <div>
        {meetingsOnThisDay.map(meeting => (
          <Tag key={meeting.id} color={meeting.priority === 'High' ? 'red' : meeting.priority === 'Medium' ? 'orange' : 'green'}>
            {meeting.title}
          </Tag>
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMeeting}>
          Schedule Meeting
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Table View" key="table">
          <Card>
            <Table
              columns={columns}
              dataSource={meetings}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Calendar" key="calendar">
          <Card>
            <Calendar
              dateCellRender={dateCellRender}
              onSelect={handleCalendarClick}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={currentMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the meeting title!' }]} >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Meeting Type"
            rules={[{ required: true, message: 'Please select meeting type!' }]} >
            <Select>
              <Option value="virtual">Virtual</Option>
              <Option value="in_person">In Person</Option>
              <Option value="phone">Phone Call</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="time"
            label="Date & Time"
            rules={[{ required: true, message: 'Please select meeting time!' }]} >
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please input the meeting location!' }]} >
            <Input />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select the priority!' }]} >
            <Select>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="participants"
            label="Participants">
            <Select mode="multiple" placeholder="Select participants">
              <Option value="John Doe">John Doe</Option>
              <Option value="Jane Smith">Jane Smith</Option>
              <Option value="Mike Johnson">Mike Johnson</Option>
              <Option value="Sarah Wilson">Sarah Wilson</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Meeting Details Modal */}
      <Modal
        title="Meeting Details"
        open={isDetailModalVisible}
        onCancel={handleDetailModalCancel}
        footer={null}
        width={600}>
        <div>
          <h3>Title: {currentMeeting?.title}</h3>
          <p><strong>Type:</strong> {currentMeeting?.type}</p>
          <p><strong>Date & Time:</strong> {new Date(currentMeeting?.startTime).toLocaleString()} - {new Date(currentMeeting?.endTime).toLocaleString()}</p>
          <p><strong>Location:</strong> {currentMeeting?.location}</p>
          <p><strong>Organizer:</strong> {currentMeeting?.organizer}</p>
          <p><strong>Participants:</strong></p>
          <ul>
            {currentMeeting?.participants?.map((participant, index) => (
              <li key={index}>{participant}</li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default Meetings;
