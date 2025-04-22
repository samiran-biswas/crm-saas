import React from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Avatar, Timeline, Button } from 'antd';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const Dashboard = () => {
  const tickets = []; // Placeholder for ticket data
  const leads = []; // Placeholder for leads data
  const customers = []; // Placeholder for customers data
  const employees = [
    { name: 'John Doe', activity: 'Resolved a support ticket', timestamp: '2025-04-22 10:30 AM' },
    { name: 'Jane Smith', activity: 'Created a new lead', timestamp: '2025-04-22 11:00 AM' },
    { name: 'Robert Johnson', activity: 'Logged into the system', timestamp: '2025-04-22 11:30 AM' },
  ];
  const openTickets = tickets.filter(ticket => ticket.status === 'Open').length;
  const closedTickets = tickets.filter(ticket => ticket.status === 'Closed').length;

  const taskStatusData = [
    { name: 'Open', value: openTickets },
    { name: 'Closed', value: closedTickets },
  ];

  const ticketPriorityData = [
    { date: '2024-01', value: 5 },
    { date: '2024-02', value: 8 },
    { date: '2024-03', value: 12 },
    { date: '2024-04', value: tickets.length },
  ];

  const employeePerformanceData = [
    { name: 'John Doe', value: 80 },
    { name: 'Jane Smith', value: 90 },
    { name: 'Robert Johnson', value: 70 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title', render: () => 'Sample Ticket' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => status || 'Open' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: () => 'Medium' },
  ];

  return (
    <div className="p-6 bg-gray-100 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">CRM Dashboard</h1>

      {/* Summary Stats Row */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={8}>
          <Card className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <Statistic title="Total Tickets" value={tickets.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <Statistic title="Total Leads" value={leads.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <Statistic title="Total Customers" value={customers.length} />
          </Card>
        </Col>
      </Row>

      {/* Graphical Data Row */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12}>
          <Card title="Task Status Distribution" className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card title="Ticket Priority Trend" className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ticketPriorityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#0088FE" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* New Widgets Section */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={8}>
          <Card title="Sales Performance" className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <Progress type="circle" percent={80} width={80} />
            <div className="text-center mt-2 text-sm">Sales Target Achieved</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card title="Employee Performance" className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeePerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card title="Customer Feedback" className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Customer Satisfaction</span>
                <span className="font-semibold text-blue-500">4.5/5</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Product Reviews</span>
                <span className="font-semibold text-blue-500">95%</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Support Satisfaction</span>
                <span className="font-semibold text-blue-500">4.7/5</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Section */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col span={24}>
          <Card title="Employee Activity Feed" className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <Timeline>
              {employees.map((activity, index) => (
                <Timeline.Item key={index}>
                  <span className="font-semibold">{activity.name}</span>: {activity.activity} <span className="text-gray-500 text-sm">({activity.timestamp})</span>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* Recent Tickets Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Recent Tickets" className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <Table
              columns={columns}
              dataSource={Array(5).fill({})}
              rowKey={(record, index) => index}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
