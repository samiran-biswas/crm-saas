import React, { useState, useEffect } from 'react';
import {
  Input, Select, Button, Checkbox, Typography, Card, Row, Col, Divider,
  notification, Tabs, Table, Modal, List
} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

const initialFields = [
  { id: uuid(), label: 'Full Name', type: 'text', required: true },
  { id: uuid(), label: 'Email', type: 'email', required: true },
];

const kycFields = [
  { label: 'Aadhaar Number', type: 'text' },
  { label: 'PAN Number', type: 'text' },
  { label: 'Address Proof', type: 'file' },
];

export default function FormBuilderWithAntd() {
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState(initialFields);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState('text');
  const [savedForms, setSavedForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const forms = JSON.parse(localStorage.getItem('savedForms')) || [];
    setSavedForms(forms);
  }, []);

  const handleAddField = () => {
    if (!newLabel.trim()) {
      notification.error({
        message: 'Field Label is required!',
        description: 'Please provide a label for the new field.',
      });
      return;
    }
    const newField = { id: uuid(), label: newLabel, type: newType, required: false };
    setFields([...fields, newField]);
    setNewLabel('');
    setNewType('text');
  };

  const toggleRequired = (id) => {
    setFields(fields.map(f => f.id === id ? { ...f, required: !f.required } : f));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(fields);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setFields(reordered);
  };

  const handleAddKYC = (kyc) => {
    const kycField = { id: uuid(), label: kyc.label, type: kyc.type, required: false };
    setFields([...fields, kycField]);
  };

  const handleSaveForm = () => {
    const newForm = {
      id: uuid(),
      name: formName,
      description: formDescription,
      fields: fields,
    };
    const updatedForms = [...savedForms, newForm];
    setSavedForms(updatedForms);
    localStorage.setItem('savedForms', JSON.stringify(updatedForms));
    setFormName('');
    setFormDescription('');
    setFields(initialFields);
    notification.success({
      message: 'Form Saved Successfully!',
      description: 'Your form has been saved to localStorage.',
    });
  };

  const handleShareForm = (formId) => {
    const shareableUrl = `${window.location.origin}/form/${formId}`;
    notification.info({
      message: 'Form Shared',
      description: `Form has been shared. You can access it using the following link: ${shareableUrl}`,
    });
    window.open(shareableUrl, '_blank');
  };

  const handleViewDetails = (form) => {
    setSelectedForm(form);
    setIsModalVisible(true);
  };

  const handleBackToForms = () => {
    setSelectedForm(null);
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Form Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleShareForm(record.id)}>Share</Button>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
        </>
      ),
    },
  ];

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-lg">
      <Title level={2} className="text-center text-blue-500">📋 Form Builder with KYC</Title>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Form Builder" key="1">
          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter Form Name"
                className="mb-2 border-gray-300"
              />
            </Col>
            <Col span={24}>
              <Input.TextArea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter Form Description"
                rows={4}
                className="border-gray-300"
              />
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col flex="auto">
              <Input
                value={newLabel}
                placeholder="Field Label"
                onChange={(e) => setNewLabel(e.target.value)}
                className="border-gray-300"
              />
            </Col>
            <Col>
              <Select value={newType} onChange={setNewType} style={{ width: 120 }} className="border-gray-300">
                <Option value="text">Text</Option>
                <Option value="email">Email</Option>
                <Option value="number">Number</Option>
                <Option value="date">Date</Option>
                <Option value="file">File Upload</Option>
              </Select>
            </Col>
            <Col>
              <Button type="primary" onClick={handleAddField} className="bg-blue-500 text-white">
                Add Field
              </Button>
            </Col>
          </Row>

          <Divider orientation="left">KYC Fields</Divider>
          <Row gutter={8} className="mb-6">
            {kycFields.map((kyc, i) => (
              <Col key={i}>
                <Button onClick={() => handleAddKYC(kyc)} className="bg-green-500 text-white">
                  {kyc.label}
                </Button>
              </Col>
            ))}
          </Row>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="formFields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Row gutter={[16, 16]} className="space-y-4">
                    {fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <Col span={24} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Card title={field.label} bordered={true} className="border-gray-300 shadow-md hover:shadow-lg">
                              <Input
                                placeholder={field.label}
                                disabled
                                type={field.type}
                                className="mb-4 p-2"
                              />
                              <Checkbox
                                checked={field.required}
                                onChange={() => toggleRequired(field.id)}
                                className="text-gray-600"
                              >
                                Required
                              </Checkbox>
                            </Card>
                          </Col>
                        )}
                      </Draggable>
                    ))}
                  </Row>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Row className="mt-4">
            <Col span={24}>
              <Button type="primary" onClick={handleSaveForm} className="bg-blue-500 text-white">
                Save Form
              </Button>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Saved Forms" key="2">
          <Table columns={columns} dataSource={savedForms} rowKey="id" />
        </TabPane>
      </Tabs>

      {/* Modal for View Details */}
      <Modal
        title={<><Button icon={<LeftOutlined />} onClick={handleBackToForms} style={{ marginRight: 10 }} />Form Details: {selectedForm?.name}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <p><strong>Description:</strong> {selectedForm?.description}</p>
        <Divider />
        <List
          dataSource={selectedForm?.fields || []}
          renderItem={item => (
            <List.Item>
              <strong>{item.label}</strong> ({item.type}) {item.required ? <span style={{ color: 'red' }}>*</span> : ''}
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { Input, Select, Button, Checkbox, Typography, Card, Row, Col, Divider, notification, Tabs, Table } from 'antd';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { v4 as uuid } from 'uuid';

// const { Option } = Select;
// const { Title } = Typography;
// const { TabPane } = Tabs;

// const initialFields = [
//   { id: uuid(), label: 'Full Name', type: 'text', required: true },
//   { id: uuid(), label: 'Email', type: 'email', required: true },
// ];

// const kycFields = [
//   { label: 'Aadhaar Number', type: 'text' },
//   { label: 'PAN Number', type: 'text' },
//   { label: 'Address Proof', type: 'file' },
// ];

// export default function FormBuilderWithAntd() {
//   const [formName, setFormName] = useState('');
//   const [formDescription, setFormDescription] = useState('');
//   const [fields, setFields] = useState(initialFields);
//   const [newLabel, setNewLabel] = useState('');
//   const [newType, setNewType] = useState('text');
//   const [savedForms, setSavedForms] = useState([]);

//   useEffect(() => {
//     // Load saved forms from localStorage
//     const forms = JSON.parse(localStorage.getItem('savedForms')) || [];
//     setSavedForms(forms);
//   }, []);

//   const handleAddField = () => {
//     if (!newLabel.trim()) {
//       notification.error({
//         message: 'Field Label is required!',
//         description: 'Please provide a label for the new field.',
//       });
//       return;
//     }
//     const newField = { id: uuid(), label: newLabel, type: newType, required: false };
//     setFields([...fields, newField]);
//     setNewLabel('');
//     setNewType('text');
//   };

//   const toggleRequired = (id) => {
//     setFields(fields.map(f => f.id === id ? { ...f, required: !f.required } : f));
//   };

//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const reordered = Array.from(fields);
//     const [removed] = reordered.splice(result.source.index, 1);
//     reordered.splice(result.destination.index, 0, removed);
//     setFields(reordered);
//   };

//   const handleAddKYC = (kyc) => {
//     const kycField = { id: uuid(), label: kyc.label, type: kyc.type, required: false };
//     setFields([...fields, kycField]);
//   };

//   const handleSaveForm = () => {
//     const newForm = {
//       id: uuid(),
//       name: formName,
//       description: formDescription,
//       fields: fields,
//     };

//     const updatedForms = [...savedForms, newForm];
//     setSavedForms(updatedForms);
//     localStorage.setItem('savedForms', JSON.stringify(updatedForms));
//     setFormName('');
//     setFormDescription('');
//     setFields(initialFields);
//     notification.success({
//       message: 'Form Saved Successfully!',
//       description: 'Your form has been saved to localStorage.',
//     });
//   };

//   const handleShareForm = (formId) => {
//     const shareableUrl = `${window.location.origin}/form/${formId}`;
//     notification.info({
//       message: 'Form Shared',
//       description: `Form has been shared. You can access it using the following link: ${shareableUrl}`,
//     });
  
//     // Open the shared form in a new tab
//     window.open(shareableUrl, '_blank');
//   };
  
  

//   const columns = [
//     { title: 'Form Name', dataIndex: 'name', key: 'name' },
//     { title: 'Description', dataIndex: 'description', key: 'description' },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <Button type="link" onClick={() => handleShareForm(record.id)}>Share</Button>
//       ),
//     },
//   ];

//   return (
//     <div className=" mx-auto p-6 bg-white rounded-xl shadow-lg">
//       <Title level={2} className="text-center text-blue-500">📋 Form Builder with KYC </Title>

//       <Tabs defaultActiveKey="1">
//         <TabPane tab="Form Builder" key="1">
//           <Row gutter={16} className="mb-4">
//             <Col span={24}>
//               <Input
//                 value={formName}
//                 onChange={(e) => setFormName(e.target.value)}
//                 placeholder="Enter Form Name"
//                 className="mb-2 border-gray-300"
//               />
//             </Col>
//             <Col span={24}>
//               <Input.TextArea
//                 value={formDescription}
//                 onChange={(e) => setFormDescription(e.target.value)}
//                 placeholder="Enter Form Description"
//                 rows={4}
//                 className="border-gray-300"
//               />
//             </Col>
//           </Row>

//           {/* Field Addition Section */}
//           <Row gutter={16} className="mb-4">
//             <Col flex="auto">
//               <Input
//                 value={newLabel}
//                 placeholder="Field Label"
//                 onChange={(e) => setNewLabel(e.target.value)}
//                 className="border-gray-300"
//               />
//             </Col>
//             <Col>
//               <Select value={newType} onChange={setNewType} style={{ width: 120 }} className="border-gray-300">
//                 <Option value="text">Text</Option>
//                 <Option value="email">Email</Option>
//                 <Option value="number">Number</Option>
//                 <Option value="date">Date</Option>
//                 <Option value="file">File Upload</Option>
//               </Select>
//             </Col>
//             <Col>
//               <Button type="primary" onClick={handleAddField} className="bg-blue-500 text-white">
//                 Add Field
//               </Button>
//             </Col>
//           </Row>

//           {/* KYC Fields */}
//           <Divider orientation="left">KYC Fields</Divider>
//           <Row gutter={8} className="mb-6">
//             {kycFields.map((kyc, i) => (
//               <Col key={i}>
//                 <Button onClick={() => handleAddKYC(kyc)} className="bg-green-500 text-white">
//                   {kyc.label}
//                 </Button>
//               </Col>
//             ))}
//           </Row>

//           {/* Draggable Fields */}
//           <DragDropContext onDragEnd={onDragEnd}>
//             <Droppable droppableId="formFields">
//               {(provided) => (
//                 <div {...provided.droppableProps} ref={provided.innerRef}>
//                   <Row gutter={[16, 16]} className="space-y-4">
//                     {fields.map((field, index) => (
//                       <Draggable key={field.id} draggableId={field.id} index={index}>
//                         {(provided) => (
//                           <Col span={24} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                             <Card title={field.label} bordered={true} className="border-gray-300 shadow-md hover:shadow-lg">
//                               <Input
//                                 placeholder={field.label}
//                                 disabled
//                                 type={field.type}
//                                 className="mb-4 p-2"
//                               />
//                               <Checkbox
//                                 checked={field.required}
//                                 onChange={() => toggleRequired(field.id)}
//                                 className="text-gray-600"
//                               >
//                                 Required
//                               </Checkbox>
//                             </Card>
//                           </Col>
//                         )}
//                       </Draggable>
//                     ))}
//                   </Row>
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           </DragDropContext>

//           {/* Save Form Button */}
//           <Row className="mt-4">
//             <Col span={24}>
//               <Button type="primary" onClick={handleSaveForm} className="bg-blue-500 text-white">
//                 Save Form
//               </Button>
//             </Col>
//           </Row>
//         </TabPane>

//         <TabPane tab="Saved Forms" key="2">
//           <Table columns={columns} dataSource={savedForms} rowKey="id" />
//         </TabPane>
//       </Tabs>
//     </div>
//   );
// }
