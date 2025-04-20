import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { fetchInvoices, createInvoice, updateInvoice, deleteInvoice, sendInvoice } from '../store/slices/invoiceSlice';

const { Option } = Select;

const Invoices = () => {
  const dispatch = useDispatch();
  const { invoices, loading } = useSelector((state) => state.invoices);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    form.setFieldsValue(invoice);
    setIsModalVisible(true);
  };

  const handleDeleteInvoice = async (id) => {
    try {
      await dispatch(deleteInvoice(id)).unwrap();
      message.success('Invoice deleted successfully');
    } catch (error) {
      message.error('Failed to delete invoice');
    }
  };

  const handleSendInvoice = async (id) => {
    try {
      await dispatch(sendInvoice({ id, emailData: {} })).unwrap();
      message.success('Invoice sent successfully');
    } catch (error) {
      message.error('Failed to send invoice');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingInvoice) {
        await dispatch(updateInvoice({ id: editingInvoice._id, ...values })).unwrap();
        message.success('Invoice updated successfully');
      } else {
        await dispatch(createInvoice(values)).unwrap();
        message.success('Invoice created successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save invoice');
    }
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
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditInvoice(record)}
          />
          <Button
            type="text"
            icon={<SendOutlined />}
            onClick={() => handleSendInvoice(record._id)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteInvoice(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddInvoice}
        >
          Create Invoice
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={invoices}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title={editingInvoice ? 'Edit Invoice' : 'Create Invoice'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="invoiceNumber"
            label="Invoice Number"
            rules={[{ required: true, message: 'Please input the invoice number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="customer"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer!' }]}
          >
            <Select>
              {/* Customer options will be populated from the backend */}
            </Select>
          </Form.Item>
          <Form.Item
            name="items"
            label="Items"
            rules={[{ required: true, message: 'Please add at least one item!' }]}
          >
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        rules={[{ required: true, message: 'Missing description' }]}
                      >
                        <Input placeholder="Description" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: 'Missing quantity' }]}
                      >
                        <InputNumber min={1} placeholder="Quantity" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'unitPrice']}
                        rules={[{ required: true, message: 'Missing unit price' }]}
                      >
                        <InputNumber min={0} placeholder="Unit Price" />
                      </Form.Item>
                      <Button type="text" danger onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      Add Item
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select a due date!' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Invoices; 