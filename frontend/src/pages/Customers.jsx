import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Tag, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../store/slices/customerSlice';

const { Option } = Select;

const Customers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const showModal = (customer = null) => {
    setEditingCustomer(customer);
    if (customer) {
      form.setFieldsValue(customer);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCustomer) {
        await dispatch(updateCustomer({ id: editingCustomer._id, ...values })).unwrap();
        message.success('Customer updated successfully');
      } else {
        await dispatch(createCustomer(values)).unwrap();
        message.success('Customer created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCustomer(id)).unwrap();
      message.success('Customer deleted successfully');
    } catch (error) {
      message.error(error.message || 'Delete failed');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Inactive' ? 'red' : 'orange'}>
          {status}
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
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Customer
        </Button>
      </div>
      <Card>
        <Table columns={columns} dataSource={customers} loading={loading} rowKey="_id" />
      </Card>

      <Modal
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the customer name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: 'Please input the company name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Customers; 