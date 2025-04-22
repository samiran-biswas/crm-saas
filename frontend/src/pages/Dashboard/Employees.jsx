import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const Employees = () => {
  const [employees, setEmployees] = useState([
    { _id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', department: 'Sales', role: 'Admin', status: 'active' },
    { _id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', department: 'Support', role: 'Agent', status: 'active' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [form] = Form.useForm();

  const user = { role: 'admin' }; // Replace with dynamic role

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => <Tag color="blue">{department}</Tag>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={role === 'admin' ? 'red' : 'green'}>{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          {user.role === 'admin' && (
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
          )}
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentEmployee(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    // Handle deletion logic (e.g., remove from the state)
    setEmployees(employees.filter((employee) => employee._id !== id));
  };

  const handleSubmit = (values) => {
    if (isEditing) {
      setEmployees(
        employees.map((employee) =>
          employee._id === currentEmployee._id ? { ...employee, ...values } : employee
        )
      );
    } else {
      setEmployees([...employees, { ...values, _id: Date.now() }]);
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="p-6">
      <Card
        title="Employees"
        extra={
          user.role === 'admin' && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
              Add Employee
            </Button>
          )
        }
      >
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={isEditing ? 'Edit Employee' : 'Add Employee'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please input the first name!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input the last name!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input the email!' }, { type: 'email' }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input the password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select the department!' }]}
          >
            <Select>
              <Option value="sales">Sales</Option>
              <Option value="support">Support</Option>
              <Option value="marketing">Marketing</Option>
              <Option value="development">Development</Option>
              <Option value="management">Management</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select the role!' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="agent">Agent</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="suspended">Suspended</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;
