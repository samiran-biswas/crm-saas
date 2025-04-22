import React, { useEffect, useState } from 'react';
import {
  Table, Button, message, Tag,
} from 'antd';
import { PlusOutlined, DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
import InvoiceForm from './InvoiceForm'; // Make sure this component is created

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const dummyData = [
          {
            _id: '1',
            invoiceNumber: 'INV001',
            customer: { name: 'John Doe' },
            total: 100,
            status: 'PENDING',
            dueDate: new Date(),
          },
        ];
        setInvoices(dummyData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleCreateInvoice = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const downloadInvoice = async (record) => {
    const input = document.getElementById(`invoice-${record._id}`);
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`invoice_${record.invoiceNumber}.pdf`);
  };

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
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
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'PAID' ? 'green' :
          status === 'PENDING' ? 'orange' :
          status === 'OVERDUE' ? 'red' : 'default'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          icon={<DownloadOutlined />}
          onClick={() => downloadInvoice(record)}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        {!showForm ? (
          <>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateInvoice}>
              Create Invoice
            </Button>
          </>
        ) : (
          <>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back
            </Button>
            <h1 className="text-2xl font-bold ml-4">Create Invoice</h1>
          </>
        )}
      </div>

      {!showForm ? (
        <Table
          columns={columns}
          dataSource={invoices}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <InvoiceForm
            onSubmit={(data) => {
              const formattedData = {
                ...data,
                _id: Date.now().toString(),
                dueDate: data.dueDate.toDate(),
                customer: { name: data.customer },
              };
              setInvoices([...invoices, formattedData]);
              message.success('Invoice created!');
              setShowForm(false);
            }}
            onCancel={handleBack}
          />
        </div>
      )}

      {/* Hidden Rendered Invoices for PDF generation */}
      {invoices.map((invoice) => (
        <div
          key={invoice._id}
          id={`invoice-${invoice._id}`}
          style={{ display: 'none', padding: 20, fontSize: 14 }}
        >
          <h2 style={{ textAlign: 'center' }}>Invoice #{invoice.invoiceNumber}</h2>
          <p><strong>Customer:</strong> {invoice.customer?.name}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          <p><strong>Due Date:</strong> {moment(invoice.dueDate).format('DD/MM/YYYY')}</p>
          <p><strong>Total Amount:</strong> ${invoice.total.toFixed(2)}</p>
          <p style={{ marginTop: 30 }}>Thank you for your business.</p>
        </div>
      ))}
    </div>
  );
};

export default Invoices;
