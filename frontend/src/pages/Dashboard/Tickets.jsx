import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Tag, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const { Option } = Select;
const { TextArea } = Input;

const Tickets = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTicket, setEditingTicket] = useState(null);
  const dispatch = useDispatch();

  
  const showModal = (ticket = null) => {
    setEditingTicket(ticket);
    if (ticket) {
      form.setFieldsValue(ticket);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingTicket) {
        await dispatch(updateTicket({ id: editingTicket._id, ...values })).unwrap();
        message.success('Ticket updated successfully');
      } else {
        await dispatch(createTicket(values)).unwrap();
        message.success('Ticket created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTicket(id)).unwrap();
      message.success('Ticket deleted successfully');
    } catch (error) {
      message.error(error.message || 'Delete failed');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => customer?.name || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'open' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={
          priority === 'high' ? 'red' : 
          priority === 'medium' ? 'orange' : 'blue'
        }>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Create Ticket
        </Button>
      </div>
      <Card>
        <Table columns={columns} dataSource={tickets} loading={loading} rowKey="_id" />
      </Card>

      <Modal
        title={editingTicket ? 'Edit Ticket' : 'Add Ticket'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the ticket title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="customer"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer!' }]}
          >
            <Select>
              {customers.map(customer => (
                <Option key={customer._id} value={customer._id}>
                  {customer.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the ticket description!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select>
              <Option value="open">Open</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select the priority!' }]}
          >
            <Select>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tickets; 