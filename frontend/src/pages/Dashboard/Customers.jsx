import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Tag, Card, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const Customers = () => {
  // Placeholder customer data
  const [customers, setCustomers] = useState([
    {
      _id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      company: 'Company A',
      status: 'Active',
      createdAt: '2023-04-01',
    },
    {
      _id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      company: 'Company B',
      status: 'Inactive',
      createdAt: '2023-03-15',
    },
  ]);
  const [filteredCustomers, setFilteredCustomers] = useState(customers); // Store filtered customers
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [form] = Form.useForm();

  // Handle form submission to add/edit a customer
  const handleSubmit = (values) => {
    if (isEditing) {
      // Update customer
      const updatedCustomers = customers.map((customer) =>
        customer._id === currentCustomer._id ? { ...customer, ...values } : customer
      );
      setCustomers(updatedCustomers);
      message.success('Customer updated successfully!');
    } else {
      // Add new customer
      const newCustomer = { ...values, _id: Date.now(), createdAt: new Date().toISOString() };
      setCustomers([...customers, newCustomer]);
      message.success('Customer added successfully!');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete customer
  const handleDeleteCustomer = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this customer?',
      onOk: () => {
        const filteredCustomers = customers.filter((customer) => customer._id !== id);
        setCustomers(filteredCustomers);
        message.success('Customer deleted successfully!');
      },
    });
  };

  // Filter the customers based on the search input
  const handleSearch = (value) => {
    const filtered = customers.filter((customer) => {
      return customer.name.toLowerCase().includes(value.toLowerCase()) || customer.phone.includes(value);
    });
    setFilteredCustomers(filtered);
  };

  // Table columns
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
            onClick={() => handleEditCustomer(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCustomer(record._id)}
          />
        </Space>
      ),
    },
  ];

  // Function to handle editing a customer
  const handleEditCustomer = (customer) => {
    setIsEditing(true);
    setCurrentCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalVisible(true);
  };

  return (
    <div className="p-6 bg-gray-50">
        {/* <Card> */}


 <Card
        title="Customers"
        extra={
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            className="bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
          >
            Add Customer
          </Button>
        }
        className="shadow-lg rounded-lg"
      >
          
   

      {/* Search Input for Name or Phone */}
      <div className="mb-6">
        <Input
          placeholder="Search by Name or Phone"
          onChange={(e) => handleSearch(e.target.value)} // Trigger search on every input change
          className="w-1/3"
        />
      </div>

    
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="_id"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      {/* Modal for Add/Edit Customer */}
      <Modal
        title={isEditing ? 'Edit Customer' : 'Add Customer'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
              { type: 'email', message: 'Please enter a valid email!' },
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
