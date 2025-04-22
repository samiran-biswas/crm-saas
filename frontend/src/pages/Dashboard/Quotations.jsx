import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Empty, Modal, Form, Input, DatePicker, InputNumber, Space } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import QuotationForm from './QuotationForm'; // Assuming the QuotationForm is in the same directory

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingQuotation, setIsCreatingQuotation] = useState(false); // State to manage form view
  const [form] = Form.useForm();

  // Simulate fetching quotations
  useEffect(() => {
    setTimeout(() => {
      setQuotations([
        {
          _id: '1',
          quotationNumber: 'QTN-2025-001',
          customer: { name: 'Rohit Sharma' },
          total: 20000,
          status: 'SENT',
          validUntil: '2025-05-15',
        },
        {
          _id: '2',
          quotationNumber: 'QTN-2025-002',
          customer: { name: 'Virat Kohli' },
          total: 45000,
          status: 'ACCEPTED',
          validUntil: '2025-05-10',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    {
      title: 'Quotation Number',
      dataIndex: 'quotationNumber',
      key: 'quotationNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => customer?.name || 'N/A',
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (amount) => `₹${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={
            status === 'ACCEPTED' ? 'green' :
            status === 'SENT' ? 'blue' :
            status === 'REJECTED' ? 'red' :
            status === 'EXPIRED' ? 'orange' : 'default'
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const handleCreateQuotation = (values) => {
    const newQuotation = {
      _id: Date.now().toString(),
      quotationNumber: `QTN-${new Date().getFullYear()}-${String(quotations.length + 1).padStart(3, '0')}`,
      customer: { name: values.customerName },
      total: values.totalAmount,
      status: 'SENT',
      validUntil: values.validUntil.format('YYYY-MM-DD'),
    };

    setQuotations([...quotations, newQuotation]);
    setIsCreatingQuotation(false); // Switch back to quotation list view
  };

  return (
    <div className="p-6">
      {isCreatingQuotation ? (
        <div>
          <Space style={{ marginBottom: 20 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setIsCreatingQuotation(false)} // Go back to quotations list
            >
              Back
            </Button>
          </Space>
          <QuotationForm onSubmit={handleCreateQuotation} />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quotations</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreatingQuotation(true)}>
              Create Quotation
            </Button>
          </div>

          {quotations.length === 0 && !loading ? (
            <Empty description="No Quotations Found" />
          ) : (
            <Table
              columns={columns}
              dataSource={quotations}
              loading={loading}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Quotations;
