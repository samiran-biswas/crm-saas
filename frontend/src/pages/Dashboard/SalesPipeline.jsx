import React, { useState, useEffect } from 'react';
import { Button, Card, Tag, Modal, Input, Select, Form, Row, Col, Tooltip, DatePicker, Spin, Table, Tabs, Calendar } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;

const stages = ['To Do', 'In Progress', 'Completed', 'On Hold'];
const priorityLevels = ['Low', 'Medium', 'High'];

const employees = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Peter Parker' },
];

const initialTasks = [
  { id: 'task-1', title: 'Fix UI Bugs', stage: 'To Do', assignedTo: ['1'], priority: 'High', dueDate: '2025-05-01', notes: '' },
  { id: 'task-2', title: 'Backend API Development', stage: 'In Progress', assignedTo: ['2'], priority: 'Medium', dueDate: '2025-04-15', notes: '' },
];

const SalesPipeline = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentTask) {
      form.setFieldsValue({
        ...currentTask,
        dueDate: currentTask.dueDate ? dayjs(currentTask.dueDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [currentTask, form]);

  const handleCreateTask = (values) => {
    setLoading(true);
    const newTask = {
      id: `task-${Date.now()}`,
      title: values.title,
      stage: values.stage,
      assignedTo: values.assignedTo,
      priority: values.priority,
      dueDate: values.dueDate?.format('YYYY-MM-DD') || '',
      notes: values.notes || '',
    };
    setTasks(prev => [...prev, newTask]);
    setLoading(false);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsModalVisible(true);
  };

  const handleUpdateTask = (values) => {
    setLoading(true);
    const updatedTask = {
      ...currentTask,
      ...values,
      dueDate: values.dueDate?.format('YYYY-MM-DD') || '',
    };
    setTasks(tasks.map(task => task.id === currentTask.id ? updatedTask : task));
    setLoading(false);
    setIsModalVisible(false);
    setCurrentTask(null);
    form.resetFields();
  };

  const moveTask = (taskId, newStage) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, stage: newStage } : task));
  };

  const taskForm = (
    <Form form={form} layout="vertical" onFinish={currentTask ? handleUpdateTask : handleCreateTask}>
      <Form.Item name="title" label="Task Title" rules={[{ required: true, message: 'Please enter task title' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="stage" label="Stage" rules={[{ required: true, message: 'Please select a stage' }]}>
        <Select>
          {stages.map(stage => (
            <Option key={stage} value={stage}>{stage}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="priority" label="Priority" rules={[{ required: true, message: 'Please select priority' }]}>
        <Select>
          {priorityLevels.map(p => <Option key={p} value={p}>{p}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="assignedTo" label="Assign to" rules={[{ required: true, message: 'Please assign at least one user' }]}>
        <Select mode="multiple" allowClear>
          {employees.map(emp => (
            <Option key={emp.id} value={emp.id}>{emp.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="dueDate" label="Due Date">
        <DatePicker />
      </Form.Item>

      <Form.Item name="notes" label="Notes">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block icon={loading ? <Spin /> : null}>
          {currentTask ? 'Update Task' : 'Create Task'}
        </Button>
      </Form.Item>
    </Form>
  );

  const columns = [
    { title: 'Task Title', dataIndex: 'title', key: 'title' },
    { title: 'Stage', dataIndex: 'stage', key: 'stage' },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo', render: (assignedTo) => assignedTo.map(id => employees.find(e => e.id === id)?.name).join(', ') },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
  ];

  const taskCalendar = (
    <Calendar
      dateCellRender={(date) => {
        const taskOnThisDay = tasks.filter(task => dayjs(task.dueDate).isSame(date, 'day'));
        return taskOnThisDay.length > 0 ? (
          <div>
            {taskOnThisDay.map(task => (
              <Tag key={task.id} color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green'}>
                {task.title}
              </Tag>
            ))}
          </div>
        ) : null;
      }}
    />
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="task-management-container p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-blue-600">Sales Pipeline</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setCurrentTask(null);
            setIsModalVisible(true);
          }}>
            Add Task
          </Button>
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Kanban" key="1">
            <Row gutter={16}>
              {stages.map((stage) => (
                <TaskColumn
                  key={stage}
                  stage={stage}
                  tasks={tasks.filter(task => task.stage === stage)}
                  moveTask={moveTask}
                  employees={employees}
                  onEdit={handleEditTask}
                />
              ))}
            </Row>
          </TabPane>
          <TabPane tab="Table" key="2">
            <Table dataSource={tasks} columns={columns} rowKey="id" />
          </TabPane>
          <TabPane tab="Calendar" key="3">
            {taskCalendar}
          </TabPane>
        </Tabs>

        <Modal
          title={currentTask ? 'Edit Task' : 'Create Task'}
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setCurrentTask(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
          destroyOnClose
        >
          {taskForm}
        </Modal>
      </div>
    </DndProvider>
  );
};

const TaskColumn = ({ stage, tasks, moveTask, employees, onEdit }) => {
  const [, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      moveTask(item.id, stage);
    },
  });

  return (
    <Col span={6}>
      <div className="task-stage" ref={drop} style={{ minHeight: '300px' }}>
        <h2 className="font-semibold text-xl">{stage}</h2>
        <div className="task-container bg-gray-100 rounded p-4">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} moveTask={moveTask} employees={employees} onEdit={onEdit} />
          ))}
        </div>
      </div>
    </Col>
  );
};

const TaskCard = ({ task, moveTask, employees, onEdit }) => {
  const [, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
  }));

  const priorityColor = {
    Low: 'green',
    Medium: 'orange',
    High: 'red',
  };

  return (
    <Card
      ref={drag}
      className="task-card bg-white p-4 shadow-lg rounded mb-4"
      onClick={() => onEdit(task)}
    >
      <h3 className="font-semibold">{task.title}</h3>
      <div className="text-sm text-gray-500">{task.dueDate}</div>
      <Tag color={priorityColor[task.priority]}>{task.priority}</Tag>
      <div className="assigned-to">Assigned to: {task.assignedTo.map(id => employees.find(e => e.id === id)?.name).join(', ')}</div>
    </Card>
  );
};

export default SalesPipeline;
