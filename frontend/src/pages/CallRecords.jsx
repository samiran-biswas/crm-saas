import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined, EditOutlined, DeleteOutlined, PhoneOutlined } from '@ant-design/icons';
import { fetchCallRecords, createCallRecord, updateCallRecord, deleteCallRecord } from '../store/slices/callRecordSlice';

const { Option } = Select;
const { TextArea } = Input;

const CallRecords = () => {
  const dispatch = useDispatch();
  const { callRecords, loading } = useSelector((state) => state.callRecords);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    dispatch(fetchCallRecords());
  }, [dispatch]);

  const handleAddRecord = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      callDate: record.callDate ? new Date(record.callDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDeleteRecord = async (id) => {
    try {
      await dispatch(deleteCallRecord(id)).unwrap();
      message.success('Call record deleted successfully');
    } catch (error) {
      message.error('Failed to delete call record');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await dispatch(updateCallRecord({ id: editingRecord._id, ...values })).unwrap();
        message.success('Call record updated successfully');
      } else {
        await dispatch(createCallRecord(values)).unwrap();
        message.success('Call record created successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save call record');
    }
  };

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
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditRecord(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRecord(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Call Records</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddRecord}
        >
          Add Call Record
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={callRecords}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title={editingRecord ? 'Edit Call Record' : 'Add Call Record'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="customer"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer!' }]}
          >
            <Select>
              {/* Customer options will be populated from the backend */}
            </Select>
          </Form.Item>
          <Form.Item
            name="callType"
            label="Call Type"
            rules={[{ required: true, message: 'Please select a call type!' }]}
          >
            <Select>
              <Option value="INCOMING">Incoming</Option>
              <Option value="OUTGOING">Outgoing</Option>
              <Option value="MISSED">Missed</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (minutes)"
            rules={[{ required: true, message: 'Please input the duration!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status!' }]}
          >
            <Select>
              <Option value="COMPLETED">Completed</Option>
              <Option value="SCHEDULED">Scheduled</Option>
              <Option value="MISSED">Missed</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="callDate"
            label="Call Date"
            rules={[{ required: true, message: 'Please select a call date!' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CallRecords; 