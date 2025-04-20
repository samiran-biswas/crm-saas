import React, { useState } from 'react';
import { Card, Button, Form, Input, Select, Switch, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Option } = Select;

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
];

const DraggableField = ({ field, index, moveField }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'FIELD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'FIELD',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveField(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '8px 0',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        cursor: 'move',
      }}
    >
      <Space>
        <DragOutlined />
        <span>{field.label || field.name}</span>
        <span style={{ color: '#999' }}>({field.type})</span>
      </Space>
    </div>
  );
};

const LeadFormGenerator = () => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const addField = () => {
    setFields([...fields, { type: 'text', name: `field_${fields.length}`, label: '', required: false }]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index, updates) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const moveField = (fromIndex, toIndex) => {
    const newFields = [...fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    setFields(newFields);
  };

  const handleSave = () => {
    if (!formName) {
      message.error('Please enter a form name');
      return;
    }

    if (fields.length === 0) {
      message.error('Please add at least one field');
      return;
    }

    // Here you would typically save the form configuration to your backend
    message.success('Form saved successfully');
  };

  return (
    <div className="p-6">
      <Card title="Lead Form Generator" className="mb-6">
        <Form layout="vertical">
          <Form.Item label="Form Name" required>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter form name"
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Enter form description"
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="Form Fields" className="mb-6">
        <DndProvider backend={HTML5Backend}>
          {fields.map((field, index) => (
            <Card key={index} className="mb-4">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Form.Item label="Field Type">
                    <Select
                      value={field.type}
                      onChange={(value) => updateField(index, { type: value })}
                      style={{ width: 200 }}
                    >
                      {fieldTypes.map((type) => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Field Label">
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      placeholder="Enter field label"
                    />
                  </Form.Item>
                  <Form.Item label="Required">
                    <Switch
                      checked={field.required}
                      onChange={(checked) => updateField(index, { required: checked })}
                    />
                  </Form.Item>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeField(index)}
                  />
                </Space>
                {field.type === 'select' && (
                  <Form.Item label="Options">
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Enter options (press enter to add)"
                      onChange={(values) => updateField(index, { options: values })}
                    />
                  </Form.Item>
                )}
              </Space>
            </Card>
          ))}
        </DndProvider>

        <Button
          type="dashed"
          onClick={addField}
          block
          icon={<PlusOutlined />}
        >
          Add Field
        </Button>
      </Card>

      <div className="flex justify-end">
        <Button type="primary" onClick={handleSave}>
          Save Form
        </Button>
      </div>
    </div>
  );
};

export default LeadFormGenerator; 