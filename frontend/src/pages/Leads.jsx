import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Button, Space, Tag, message, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchLeads, deleteLead } from '../store/slices/leadSlice';
import { useNavigate } from 'react-router-dom';

const Leads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leads = [], loading, error } = useSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteLead(id)).unwrap();
      message.success('Lead deleted successfully');
    } catch (error) {
      message.error('Failed to delete lead');
    }
  };

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
        const color = status === 'new' ? 'blue' : 
                     status === 'contacted' ? 'green' : 
                     status === 'qualified' ? 'orange' : 
                     status === 'proposal' ? 'purple' : 
                     status === 'negotiation' ? 'cyan' : 
                     status === 'closed_won' ? 'success' : 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/leads/${record._id}/edit`)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Leads"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/leads/new')}
          >
            Add Lead
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={Array.isArray(leads) ? leads : []}
          loading={loading}
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
    </div>
  );
};

export default Leads; 