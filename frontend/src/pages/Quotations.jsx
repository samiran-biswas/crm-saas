import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined, FileAddOutlined } from '@ant-design/icons';
import { fetchQuotations, createQuotation, updateQuotation, deleteQuotation, sendQuotation, convertToInvoice } from '../store/slices/quotationSlice';

const { Option } = Select;

const Quotations = () => {
  const dispatch = useDispatch();
  const { quotations, loading } = useSelector((state) => state.quotations);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingQuotation, setEditingQuotation] = useState(null);

  useEffect(() => {
    dispatch(fetchQuotations());
  }, [dispatch]);

  const handleAddQuotation = () => {
    setEditingQuotation(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditQuotation = (quotation) => {
    setEditingQuotation(quotation);
    form.setFieldsValue(quotation);
    setIsModalVisible(true);
  };

  const handleDeleteQuotation = async (id) => {
    try {
      await dispatch(deleteQuotation(id)).unwrap();
      message.success('Quotation deleted successfully');
    } catch (error) {
      message.error('Failed to delete quotation');
    }
  };

  const handleSendQuotation = async (id) => {
    try {
      await dispatch(sendQuotation({ id, emailData: {} })).unwrap();
      message.success('Quotation sent successfully');
    } catch (error) {
      message.error('Failed to send quotation');
    }
  };

  const handleConvertToInvoice = async (id) => {
    try {
      await dispatch(convertToInvoice(id)).unwrap();
      message.success('Quotation converted to invoice successfully');
    } catch (error) {
      message.error('Failed to convert quotation to invoice');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingQuotation) {
        await dispatch(updateQuotation({ id: editingQuotation._id, ...values })).unwrap();
        message.success('Quotation updated successfully');
      } else {
        await dispatch(createQuotation(values)).unwrap();
        message.success('Quotation created successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save quotation');
    }
  };

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
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'ACCEPTED' ? 'green' :
          status === 'SENT' ? 'blue' :
          status === 'REJECTED' ? 'red' :
          status === 'EXPIRED' ? 'orange' : 'default'
        }>
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditQuotation(record)}
          />
          <Button
            type="text"
            icon={<SendOutlined />}
            onClick={() => handleSendQuotation(record._id)}
          />
          {record.status === 'ACCEPTED' && !record.convertedToInvoice && (
            <Button
              type="text"
              icon={<FileAddOutlined />}
              onClick={() => handleConvertToInvoice(record._id)}
            />
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteQuotation(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quotations</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddQuotation}
        >
          Create Quotation
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={quotations}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title={editingQuotation ? 'Edit Quotation' : 'Create Quotation'}
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
            name="quotationNumber"
            label="Quotation Number"
            rules={[{ required: true, message: 'Please input the quotation number!' }]}
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
            name="validUntil"
            label="Valid Until"
            rules={[{ required: true, message: 'Please select a valid until date!' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="termsAndConditions"
            label="Terms and Conditions"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Quotations; 