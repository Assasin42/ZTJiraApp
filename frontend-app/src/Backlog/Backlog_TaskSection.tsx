import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal, Radio, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { IKart, StatusId } from '../MyMenu';
import Item from 'antd/es/list/Item';
import { deleteKart, fetchKartlar, fetchProjeler, fetchTodo, updateKart, updateproject } from '../Api';
import loadPage from '../Card/Cards';
import MyTag from '../Form/tags';
import { fixKart } from '../Api';
type ListelerProps = {
  data: IKart[];
  status?:StatusId;
};


const Mytask: React.FC<ListelerProps> = ({status}) => {
const [role, setRole] = useState<string | null>(null);

useEffect(() => {
  setRole(localStorage.getItem("role"));
}, []);
 const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // her sayfada kaç kayıt gözüksün?
const [missions, setMissions] = useState<IKart[]>([]);
const [editingMission, setEditingMission] = useState<IKart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
const [form] = Form.useForm();
  useEffect(() => {
  if (status === StatusId.Open) {
    fetchKartlar().then(setMissions);
  } else if (status === StatusId.Todo) {
    fetchTodo().then(setMissions);
  }
}, [status]);  

const handleMove = async (record: IKart) => {
  try {
    const newStatus =
      status === StatusId.Open ? StatusId.Todo : StatusId.Open;

    await fixKart(record._id, { status: newStatus });
if (status === StatusId.Open && role === "admin") {
  messageApi.open({
      type: "success",
      content: "Görev kabul edildi",
    });
  } else {messageApi.open({
      type: "success",
      content: "Görev beklemeye alındı",
    });}

    // 🔥 bulunduğu listeden kaldır
    setMissions(prev => prev.filter(m => m._id !== record._id));

  } catch (err) {
    console.error(err);
  }
};
  const handleEdit = (record: IKart) => {
    setEditingMission(record);
    form.setFieldsValue(record); // form alanlarını doldurur
    setIsModalOpen(true);
   
  }
  const reloadData = () => {
  if (status === StatusId.Open) {
    fetchKartlar().then(setMissions);
  } else if (status === StatusId.Todo) {
    fetchTodo().then(setMissions);
  }
};  
  // ✅ Kart silme
const handleDelete = async (id: number) => {
  try {
    await deleteKart(id);

    messageApi.open({
      type: "success",
      content: "Kart silindi",
    });

    reloadData();
  } catch (err) {
    console.error(err);

    messageApi.open({
      type: "error",
      content: "Silme işlemi başarısız",
    });
  }
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
      key: 'tip',
    },
    {
      title: 'Amacı',
      dataIndex: 'projectGoal',
      key: 'amaci',
    },
    {
      title: 'Büyüklüğü',
      dataIndex: 'taskType',
      key: 'büyüklük',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {(tags ?? []).map((tags: string) => { // ✅ null ise boş array
            let color = tags.length > 4 ? 'geekblue' : 'green';
            if (tags === 'Ziraat') {
              color = 'volcano';
            }
            if (tags === 'Finans') {
              color = 'green';
            }
            if (tags === 'Ziraat Teknoloji') {
              color = 'blue';
            }
            if (tags === 'Yazılım') {
              color = 'purple';
            }
            else {
              <p>Belirtilmedi</p>
            }

            return (
              <Tag color={color} key={tags}>
                {tags.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },

    {
  title: 'Action',
  key: 'action',
  render: (_, record: IKart) => (
    <Space size="middle">   
      <a onClick={() => handleEdit(record)}>Güncelle</a>
      <a onClick={() => handleDelete(record._id)}>Delete</a>
   {role === "admin" && (
        <>
      <a onClick={() => handleMove(record)}>
        {status === StatusId.Open ? "Görevi Kabul Et" : "Görevi Beklemeye Al"}
      </a>   </>
)}
    </Space>
  ),
}
  ];

  return (<>
  {contextHolder}
  <Table<any> 
  columns={columns} dataSource={missions} rowKey={(record) => record._id}  
  pagination={
      {
        
        current: currentPage,
        pageSize: pageSize,
        total: missions.length,//projede kaç satır olduğunu gösterir
        onChange: (page, size) => {
          setCurrentPage(page);
          setPageSize(size ?? 5);
        },
        
      }
  } />
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
  if (editingMission) {
    try {
      await updateKart(editingMission._id, values);

      messageApi.open({
        type: "success",
        content: "Kart başarıyla güncellendi",
        duration: 1.5,
      });

      reloadData();
    } catch (error) {
      console.error(error);

      messageApi.open({
        type: "error",
        content: "Güncelleme başarısız",
      });
    }
  }

  setIsModalOpen(false);
}}
        >
          <Form.Item label="Görev Adı" name="projectName">
            <Input />
          </Form.Item>
          <Form.Item label="Görev Amacı" name="projectGoal">
            <Input />
          </Form.Item>
          <Form.Item label="Görevin Büyüklüğü" name="taskType">
            <Radio.Group>
              <Radio.Button value="xs">x-small</Radio.Button>
              <Radio.Button value="sm">small</Radio.Button>
              <Radio.Button value="md">medium</Radio.Button>
              <Radio.Button value="lg">large</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="tags">
            <MyTag />
          </Form.Item>
        </Form>
      </Modal>  
      </>);
};

export default Mytask;