import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const CallRecords = () => {
  // Placeholder data for call records
  const [callRecords, setCallRecords] = useState([
    {
      _id: 1,
      customer: { name: 'John Doe' },
      callType: 'INCOMING',
      duration: 10,
      status: 'COMPLETED',
      callDate: '2025-04-21T12:00:00Z',
    },
    {
      _id: 2,
      customer: { name: 'Jane Smith' },
      callType: 'OUTGOING',
      duration: 15,
      status: 'MISSED',
      callDate: '2025-04-20T09:00:00Z',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => customer?.name || 'N/A',
    },
    {
      title: 'Call Type',
      dataIndex: 'callType',
      key: 'callType',
      render: (type) => (
        <Tag color={
          type === 'INCOMING' ? 'blue' :
          type === 'OUTGOING' ? 'green' :
          type === 'MISSED' ? 'red' : 'default'
        }>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} minutes`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'COMPLETED' ? 'green' :
          status === 'SCHEDULED' ? 'blue' :
          status === 'MISSED' ? 'red' : 'default'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Call Date',
      dataIndex: 'callDate',
      key: 'callDate',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      customer: record.customer?.name,
      callType: record.callType,
      duration: record.duration,
      status: record.status,
      callDate: moment(record.callDate),
      notes: record.notes,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setCallRecords(callRecords.filter(record => record._id !== id));
    message.success('Call record deleted successfully');
  };

  const handleAdd = () => {
    setCurrentRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values) => {
    if (currentRecord) {
      // Update the existing record
      setCallRecords(callRecords.map(record =>
        record._id === currentRecord._id ? { ...record, ...values } : record
      ));
      message.success('Call record updated successfully');
    } else {
      // Add new record
      const newRecord = {
        _id: Math.floor(Math.random() * 1000),
        ...values,
        customer: { name: values.customer },
        callDate: values.callDate.toISOString(),
      };
      setCallRecords([...callRecords, newRecord]);
      message.success('Call record added successfully');
    }
    setIsModalVisible(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Call Records</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Call Record
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={callRecords}
        rowKey="_id"
      />

      {/* Modal to Add/Edit Call Record */}
      <Modal
        title={currentRecord ? 'Edit Call Record' : 'Add Call Record'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item name="customer" label="Customer" rules={[{ required: true, message: 'Please select a customer' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="callType" label="Call Type" rules={[{ required: true, message: 'Please select a call type' }]}>
            <Select>
              <Option value="INCOMING">Incoming</Option>
              <Option value="OUTGOING">Outgoing</Option>
              <Option value="MISSED">Missed</Option>
            </Select>
          </Form.Item>
          <Form.Item name="duration" label="Duration (minutes)" rules={[{ required: true, message: 'Please enter the duration' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status' }]}>
            <Select>
              <Option value="COMPLETED">Completed</Option>
              <Option value="SCHEDULED">Scheduled</Option>
              <Option value="MISSED">Missed</Option>
            </Select>
          </Form.Item>
          <Form.Item name="callDate" label="Call Date" rules={[{ required: true, message: 'Please select a call date' }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CallRecords;
