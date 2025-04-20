import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  message,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Divider,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeePermissions,
} from '../store/slices/employeeSlice';

const { Title } = Typography;
const { Option } = Select;

const Employees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employees = [], loading, error } = useSelector((state) => state.employees);
  const { user } = useSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setIsModalVisible(true);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
      message.success('Employee deleted successfully');
    } catch (error) {
      message.error('Failed to delete employee');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingEmployee) {
        await dispatch(updateEmployee({ id: editingEmployee._id, ...values })).unwrap();
        message.success('Employee updated successfully');
      } else {
        await dispatch(createEmployee(values)).unwrap();
        message.success('Employee created successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save employee');
    }
  };

  const handlePermissionChange = async (employeeId, module, permission, value) => {
    try {
      const employee = employees.find(emp => emp._id === employeeId);
      const updatedPermissions = {
        ...employee.permissions,
        [module]: {
          ...employee.permissions[module],
          [permission]: value,
        },
      };
      await dispatch(updateEmployeePermissions({ id: employeeId, permissions: updatedPermissions })).unwrap();
      message.success('Permissions updated successfully');
    } catch (error) {
      // Error is already handled by the slice
    }
  };

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
        <Tag color={status === 'active' ? 'success' : status === 'inactive' ? 'warning' : 'error'}>
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
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditEmployee(record)}
          />
          {user.role === 'admin' && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteEmployee(record._id)}
            />
          )}
        </Space>
      ),
    },
  ];

  const permissionColumns = [
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
    },
    {
      title: 'View',
      dataIndex: 'view',
      key: 'view',
      render: (_, record) => (
        <Switch
          checked={record.view}
          onChange={(checked) => handlePermissionChange(record.employeeId, record.module, 'view', checked)}
        />
      ),
    },
    {
      title: 'Create',
      dataIndex: 'create',
      key: 'create',
      render: (_, record) => (
        <Switch
          checked={record.create}
          onChange={(checked) => handlePermissionChange(record.employeeId, record.module, 'create', checked)}
        />
      ),
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      render: (_, record) => (
        <Switch
          checked={record.edit}
          onChange={(checked) => handlePermissionChange(record.employeeId, record.module, 'edit', checked)}
        />
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      render: (_, record) => (
        <Switch
          checked={record.delete}
          onChange={(checked) => handlePermissionChange(record.employeeId, record.module, 'delete', checked)}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Employees"
        extra={
          user.role === 'admin' && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddEmployee}
            >
              Add Employee
            </Button>
          )
        }
      >
        <Table
          columns={columns}
          dataSource={employees}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <Title level={5}>Permissions</Title>
                <Table
                  columns={permissionColumns}
                  dataSource={Object.entries(record.permissions).map(([module, perms]) => ({
                    key: module,
                    module,
                    employeeId: record._id,
                    ...perms,
                  }))}
                  pagination={false}
                />
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            role: 'user',
            department: 'sales',
            status: 'active',
          }}
        >
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
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          {!editingEmployee && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input the password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
          )}

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

          {user.role === 'admin' && (
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
          )}

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