import React, { useState } from 'react';
import { Card, Table, Tag, Empty, Button, Form, Input, Select, Modal, message, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const Leads = () => {
  // Local state for leads and form modal visibility
  const [leads, setLeads] = useState([
    {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      company: 'Acme Corp',
      status: 'new',
      createdAt: '2025-04-01',
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '234-567-8901',
      company: 'Beta LLC',
      status: 'contacted',
      createdAt: '2025-04-02',
    },
    {
      _id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '345-678-9012',
      company: 'Gamma Inc',
      status: 'qualified',
      createdAt: '2025-04-03',
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [filteredData, setFilteredData] = useState(leads); // Filtered leads based on search and date

  // Handle form submission to add a new lead
  const handleAddLead = (values) => {
    const newLead = { ...values, _id: new Date().toISOString(), createdAt: new Date().toISOString() }; // Generate unique ID for the new lead
    setLeads((prevLeads) => [...prevLeads, newLead]); // Update leads state with new lead
    message.success('Lead added successfully!');
    setIsModalVisible(false); // Close the modal
    form.resetFields(); // Reset form fields
  };

  // Filter leads based on name, email, phone, or date
  const handleSearch = (value) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(lowercasedValue) ||
        lead.email.toLowerCase().includes(lowercasedValue) ||
        lead.phone.includes(value)
    );
    setFilteredData(filtered);
  };

  // Filter leads by selected date range
  const handleDateFilter = (dates) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0].startOf('day');
      const endDate = dates[1].endOf('day');
      const filtered = leads.filter((lead) => {
        const createdAt = moment(lead.createdAt);
        return createdAt.isBetween(startDate, endDate, null, '[]');
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(leads);
    }
  };

  // Define columns for the leads table
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
      render: (status) => {
        const color =
          status === 'new'
            ? 'blue'
            : status === 'contacted'
            ? 'green'
            : status === 'qualified'
            ? 'orange'
            : status === 'proposal'
            ? 'purple'
            : status === 'negotiation'
            ? 'cyan'
            : status === 'closed_won'
            ? 'success'
            : 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('YYYY-MM-DD'),
    },
  ];

  return (
    <div className="p-6 bg-gray-50">
      {/* Main Card with Leads Table */}
      <Card
        title="Leads"
        extra={
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            className="bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
          >
            Add Lead
          </Button>
        }
        className="shadow-lg rounded-lg"
      >
        <div className="mb-4 flex justify-between items-center">
          {/* Search Input */}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search by name, email, or phone"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Filter */}
          <DatePicker.RangePicker
            onChange={handleDateFilter}
            className="w-72"
            format="YYYY-MM-DD"
            allowClear={true}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          locale={{
            emptyText: <Empty description="No leads found" />,
          }}
        />
      </Card>

      {/* Add Lead Modal */}
      <Modal
        title="Add New Lead"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
        className="rounded-lg"
      >
        <Form
          form={form}
          onFinish={handleAddLead}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name!' }]}
          >
            <Input
              placeholder="Enter lead's name"
              className="border-2 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter the email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              placeholder="Enter lead's email"
              className="border-2 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter the phone number!' }]}
          >
            <Input
              placeholder="Enter lead's phone"
              className="border-2 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            label="Company"
            name="company"
            rules={[{ required: true, message: 'Please enter the company!' }]}
          >
            <Input
              placeholder="Enter lead's company"
              className="border-2 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select
              placeholder="Select lead status"
              className="border-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Select.Option value="new">New</Select.Option>
              <Select.Option value="contacted">Contacted</Select.Option>
              <Select.Option value="qualified">Qualified</Select.Option>
              <Select.Option value="proposal">Proposal</Select.Option>
              <Select.Option value="negotiation">Negotiation</Select.Option>
              <Select.Option value="closed_won">Closed - Won</Select.Option>
              <Select.Option value="closed_lost">Closed - Lost</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button
              onClick={() => setIsModalVisible(false)}
              className="bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
            >
              Add Lead
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Leads;
