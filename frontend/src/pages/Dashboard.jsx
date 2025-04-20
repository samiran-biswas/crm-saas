import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setTickets, setLeads, setCustomers, setLoading } from '../store/slices/dashboardSlice';
import axios from '../utils/axios';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets, leads, customers, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get('/api/dashboard');
        const { data } = response.data;

        // Update the state with the dashboard data
        dispatch(setTickets(Array(data.openTickets).fill({ status: 'open' }))); // Temporary mock data
        dispatch(setLeads(Array(data.totalLeads).fill({}))); // Temporary mock data
        dispatch(setCustomers(Array(data.totalCustomers).fill({}))); // Temporary mock data
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  // Task status data for pie chart
  const taskStatusData = [
    { name: 'Open', value: tickets.length },
    { name: 'Closed', value: 0 },
  ];

  // Ticket priority data for line chart
  const ticketPriorityData = [
    { date: '2024-01', value: 5 },
    { date: '2024-02', value: 8 },
    { date: '2024-03', value: 12 },
    { date: '2024-04', value: tickets.length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: () => 'Sample Ticket',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status || 'Open',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: () => 'Medium',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Tickets"
              value={tickets.length}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Leads"
              value={leads.length}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Customers"
              value={customers.length}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <Card title="Task Status Distribution">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Ticket Priority Trend">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ticketPriorityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Recent Tickets" className="mt-6">
        <Table
          columns={columns}
          dataSource={Array(5).fill({})}
          loading={loading}
          rowKey={(record, index) => index}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard; 