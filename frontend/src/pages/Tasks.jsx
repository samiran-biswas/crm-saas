import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, message, Space, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';

const { Option } = Select;
const { TextArea } = Input;

const Tasks = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTask, setEditingTask] = useState(null);
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const showModal = (task = null) => {
    setEditingTask(task);
    if (task) {
      form.setFieldsValue(task);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask._id, ...values })).unwrap();
        message.success('Task updated successfully');
      } else {
        await dispatch(createTask(values)).unwrap();
        message.success('Task created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Error is already handled by the slice
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      message.success('Task deleted successfully');
    } catch (error) {
      // Error is already handled by the slice
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'todo' ? '#f50' :
          status === 'in_progress' ? '#2db7f5' :
          status === 'review' ? '#87d068' :
          '#108ee9'
        }>
          {status.replace('_', ' ').toUpperCase()}
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
          priority === 'medium' ? 'orange' :
          priority === 'low' ? 'green' : 'blue'
        }>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            type="text"
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
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Task
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={tasks}
          loading={loading}
          rowKey="_id"
        />
      </Card>

      <Modal
        title={editingTask ? 'Edit Task' : 'Add Task'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the task title!' }]}
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
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select>
              <Option value="todo">To Do</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="review">Review</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select the priority!' }]}
          >
            <Select>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="urgent">Urgent</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="assignedTo"
            label="Assign To"
            rules={[{ required: true, message: 'Please select an assignee!' }]}
          >
            <Select>
              {/* Add user options here */}
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks; 