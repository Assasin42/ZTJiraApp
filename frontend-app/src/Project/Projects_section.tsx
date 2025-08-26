import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { IKart } from '../MyMenu';
import { fetchProjeler, updateproject } from '../Api';
import MyTag from '../Form/tags';

const MyList: React.FC<any> = () => {
  const [projeler, setProjeler] = useState<IKart[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [form] = Form.useForm();

  const [editingProjects, setEditingProjects] = useState<IKart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjeler().then((data) => {
      setProjeler(data);
    });
  }, []);

  // ✅ Kart silme
  const handleDelete = (id: number) => {
    const newData = projeler.filter((item) => item._id !== id);
    setProjeler(newData);
  };

  // ✅ Kart düzenleme (modalı açar ve formu doldurur)
  const handleEdit = (record: IKart) => {
    setEditingProjects(record);
    form.setFieldsValue(record); // form alanlarını doldur
    setIsModalOpen(true);
  };

  const columns: TableProps<IKart>['columns'] = [
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Hedef',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Amacı',
      dataIndex: 'projectGoal',
      key: 'projectGoal',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {(tags ?? []).map((tag: string) => {
            let color = 'green';
            if (tag === 'Ziraat') color = 'volcano';
            if (tag === 'Finans') color = 'green';
            if (tag === 'Ziraat Teknoloji') color = 'blue';
            if (tag === 'Yazılım') color = 'purple';

            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Eylemler',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* ✅ Güncelle */}
          <a onClick={() => handleEdit(record)}>Güncelle</a>
          <a onClick={() => handleDelete(record._id)}>Sil</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table<IKart>
        columns={columns}
        dataSource={projeler}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: projeler.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size ?? 5);
          },
        }}
      />

      {/* ✅ Güncelleme Modalı */}
      <Modal
        title="Kartı Düzenle"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()} // formu submit et
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            if (editingProjects) {
              try {
                await updateproject(editingProjects._id, values); // ✅ API çağrısı
                console.log('Kart güncellendi:', values);

                // kartları yeniden çek
                fetchProjeler().then((data) => setProjeler(data));
              } catch (error) {
                console.error('Kart güncellenirken hata:', error);
              }
            }
            setIsModalOpen(false);
          }}
        >
          <Form.Item
            label="Proje Adı"
            name="projectName"
            rules={[{ required: true, message: 'Proje adı gerekli!' }]}
          >
            <Input placeholder="Proje adını girin" />
          </Form.Item>

          <Form.Item
            label="Proje Amacı"
            name="projectGoal"
            rules={[{ required: true, message: 'Proje amacı gerekli!' }]}
          >
            <Input placeholder="Proje amacını girin" />
          </Form.Item>

          <Form.Item label="Etiketler" name="tags">
            <MyTag />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MyList;
