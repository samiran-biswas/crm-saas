import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Table, InputNumber, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';

const { Option } = Select;

const QuotationForm = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([{ key: 0, item: '', description: '', quantity: 1, price: 0 }]);

  const handleAddItem = () => {
    const newItem = { key: items.length, item: '', description: '', quantity: 1, price: 0 };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (key) => {
    setItems(items.filter(item => item.key !== key));
  };

  const handleChangeItem = (key, field, value) => {
    const updated = items.map(item =>
      item.key === key ? { ...item, [field]: value } : item
    );
    setItems(updated);
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Quotation", 20, 20);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total: ₹${calculateTotal().toFixed(2)}`, 20, 40);
    doc.save('quotation.pdf');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Client" name="client" rules={[{ required: true }]}>
              <Select placeholder="Select client">
                <Option value="Client A">Client A</Option>
                <Option value="Client B">Client B</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Quotation Number" name="number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Year" name="year" initialValue={new Date().getFullYear()}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Currency" name="currency" initialValue="INR">
              <Select>
                <Option value="USD">$ (US Dollar)</Option>
                <Option value="INR">₹ (Indian Rupee)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Status" name="status" initialValue="Draft">
              <Select>
                <Option value="Draft">Draft</Option>
                <Option value="Sent">Sent</Option>
                <Option value="Accepted">Accepted</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Quotation Date" name="date">
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Valid Until" name="validUntil">
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Note" name="note">
              <Input.TextArea rows={1} />
            </Form.Item>
          </Col>
        </Row>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Items</h3>
          <Table
            dataSource={items}
            pagination={false}
            bordered
            rowKey="key"
            columns={[
              {
                title: 'Item',
                dataIndex: 'item',
                render: (_, record) => (
                  <Input
                    value={record.item}
                    onChange={e => handleChangeItem(record.key, 'item', e.target.value)}
                  />
                ),
              },
              {
                title: 'Description',
                dataIndex: 'description',
                render: (_, record) => (
                  <Input
                    value={record.description}
                    onChange={e => handleChangeItem(record.key, 'description', e.target.value)}
                  />
                ),
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                render: (_, record) => (
                  <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={value => handleChangeItem(record.key, 'quantity', value)}
                  />
                ),
              },
              {
                title: 'Price',
                dataIndex: 'price',
                render: (_, record) => (
                  <InputNumber
                    min={0}
                    value={record.price}
                    prefix="₹"
                    onChange={value => handleChangeItem(record.key, 'price', value)}
                  />
                ),
              },
              {
                title: 'Total',
                render: (_, record) => (
                  <span>₹{(record.quantity * record.price).toFixed(2)}</span>
                ),
              },
              {
                render: (_, record) => (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.key)}
                  />
                ),
              },
            ]}
          />
          <Button type="dashed" icon={<PlusOutlined />} className="mt-2" onClick={handleAddItem}>
            Add Item
          </Button>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="text-right">
            <p>Subtotal: ₹{calculateTotal().toFixed(2)}</p>
            <p>Tax: ₹0.00</p>
            <h3 className="text-xl font-semibold">Total: ₹{calculateTotal().toFixed(2)}</h3>
            <Space className="mt-3">
              <Button type="primary" htmlType="submit">Save Quotation</Button>
              <Button icon={<DownloadOutlined />} onClick={downloadPDF}>Download PDF</Button>
            </Space>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default QuotationForm;
