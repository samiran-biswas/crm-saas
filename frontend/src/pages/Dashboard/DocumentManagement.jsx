import React, { useState, useEffect } from 'react';
import { Upload, Button, Modal, Select, Input, List, Tag, Tabs, Divider } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;

const categories = ['Invoices', 'Contracts', 'Reports', 'Employee Documents'];

const DocumentManagement = () => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [documentHistory, setDocumentHistory] = useState([
    { action: 'Uploaded', user: 'John Doe', timestamp: '2025-04-21' },
    { action: 'Viewed', user: 'Jane Doe', timestamp: '2025-04-22' },
  ]);
  const [downloadStats, setDownloadStats] = useState({
    'doc123': { downloads: 0, lastDownloadedBy: '' },
  });
  const [expirationDate, setExpirationDate] = useState(null);

  const handlePreview = async (file) => {
    if (file.type === 'application/pdf') {
      setPreviewImage(URL.createObjectURL(file.originFileObj));
    } else {
      setPreviewImage(file.url || file.thumbUrl);
    }
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => setPreviewVisible(false);

  const handleChange = ({ fileList }) => setFileList(fileList);

  const handleCategoryChange = (value) => setCategory(value);

  const handleTagChange = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDownload = (fileId) => {
    setDownloadStats((prev) => ({
      ...prev,
      [fileId]: {
        downloads: prev[fileId]?.downloads + 1 || 1,
        lastDownloadedBy: 'User XYZ',
      },
    }));
  };

  const handleExpirationChange = (date) => {
    setExpirationDate(date);
  };

  const handleShare = (documentId, email) => {
    console.log(`Document ${documentId} shared with ${email}`);
  };

  useEffect(() => {
    if (expirationDate && dayjs(expirationDate).isBefore(dayjs())) {
      alert('This document has expired!');
    }
  }, [expirationDate]);

  const handleSetExpiration = (date) => {
    setExpirationDate(date);
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f4f7fa', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', color: '#1890ff', marginBottom: '20px' }}>Document Management System</h1>

      {/* Tab-based Layout */}
      <Tabs defaultActiveKey="1" type="card" style={{ marginBottom: '30px' }}>
        <TabPane tab="Upload & Manage" key="1">
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
              style={{ marginBottom: '20px' }}
            >
              <Button icon={<UploadOutlined />} style={{ display: 'block', width: '100%', backgroundColor: '#4CAF50', color: '#fff' }}>
                Upload Document
              </Button>
            </Upload>

            <Modal visible={previewVisible} footer={null} onCancel={handleCancelPreview}>
              <img alt="document preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>

            {/* Category Selection */}
            <Select
              style={{ width: '200px', marginBottom: '20px', display: 'block' }}
              placeholder="Select Document Category"
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>

            {/* Tagging */}
            <Input
              placeholder="Add Tag"
              onPressEnter={(e) => handleTagChange(e.target.value)}
              style={{ marginBottom: '20px', display: 'block' }}
            />
            <div>
              {tags.map((tag, index) => (
                <Tag key={index} color="blue" style={{ marginBottom: '5px' }}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </TabPane>

        <TabPane tab="Document Versions" key="2">
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h3 style={{ color: '#1890ff' }}>Document Versions</h3>
            <Divider />
            <List
              dataSource={[
                { version: 1, file: 'file-v1.pdf', date: '2025-04-21' },
                { version: 2, file: 'file-v2.pdf', date: '2025-04-22' },
              ]}
              renderItem={(item) => (
                <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>{item.file} (Version {item.version}) - {item.date}</div>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(item.file)}
                    style={{ backgroundColor: '#4CAF50', color: '#fff' }}
                  >
                    Download
                  </Button>
                </List.Item>
              )}
            />
          </div>
        </TabPane>

        <TabPane tab="Document Sharing" key="3">
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h3 style={{ color: '#1890ff' }}>Share Document</h3>
            <Divider />
            <Input
              placeholder="Enter email to share"
              style={{ width: '300px', marginBottom: '20px' }}
            />
            <Button
              type="primary"
              onClick={() => handleShare('doc123', 'email@example.com')}
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
            >
              Share Document
            </Button>
          </div>
        </TabPane>

        <TabPane tab="Expiration Management" key="4">
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h3 style={{ color: '#1890ff' }}>Set Document Expiration</h3>
            <Divider />
            <Input
              placeholder="Set expiration date"
              type="date"
              onChange={(e) => handleSetExpiration(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
          </div>
        </TabPane>

        <TabPane tab="Document History" key="5">
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h3 style={{ color: '#1890ff' }}>Document History</h3>
            <Divider />
            <List
              dataSource={documentHistory}
              renderItem={(item) => (
                <List.Item style={{ padding: '10px 0', fontSize: '14px' }}>
                  <div>{item.user} {item.action} the document on {item.timestamp}</div>
                </List.Item>
              )}
            />
          </div>
        </TabPane>

        <TabPane tab="Download Stats" key="6">
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h3 style={{ color: '#1890ff' }}>Download Statistics</h3>
            <Divider />
            <div>Document 'doc123' downloaded {downloadStats['doc123']?.downloads || 0} times</div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DocumentManagement;
