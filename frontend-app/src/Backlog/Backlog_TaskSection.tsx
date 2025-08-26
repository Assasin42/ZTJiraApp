import React, { useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { IKart, StatusId } from '../MyMenu';
import Item from 'antd/es/list/Item';

type ListelerProps = {
  data: IKart[];
  status?:StatusId;
};



const Mytask: React.FC<ListelerProps> = ({data}) => {
 const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // her sayfada kaç kayıt gözüksün?

  const handleDelete = (keyToDelete: string) => {
    const newData = data.filter((item: any) => item.key !== keyToDelete);
 console.log("Silinecek:", keyToDelete, newData);
  };
  const columns: TableProps<IKart>['columns'] = [
    {
      title: 'Tür',
      dataIndex: 'type',
      key: 'name',
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
      render: (_, record:any) => (
        <Space size="middle">
          <a>Güncelle {record.name}</a>
          <a onClick={() => handleDelete(record.key)}>Delete</a>
        </Space>
      ),
    },
  ];

  return <Table<any> columns={columns} dataSource={data} rowKey={(record) => record._id} 
  pagination={
      {
        current: currentPage,
        pageSize: pageSize,
        total: data.length,//projede kaç satır olduğunu gösterir
        onChange: (page, size) => {
          setCurrentPage(page);
          setPageSize(size ?? 5);
        },
      }
  } />;
};

export default Mytask;