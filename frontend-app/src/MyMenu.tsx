import React, { useEffect, useState } from 'react';
import { Button, Layout, Menu, Modal, theme } from 'antd';
import MyMiniForm from './Form/MyMiniform';
import Kartlar from './Cards';
import { fetchDone, fetchInProcess, fetchInreviev, fetchKartlar, fetchProjeler, fetchTodo, veriGonder } from './Api';

import MyList from './Project/Projects_section';
import Backlog from './Backlog/Backlog';

// import {
//   UserOutlined,
//   VideoCameraOutlined,
//   UploadOutlined,
// } from '@ant-design/icons';

export interface IKart {
  _id: number;
  type: string;
  projectGoal: string;
  projectName: string;
  taskType?: "xs" | "sm" | "md" | "lg";
  tags?: string[];
  status?: StatusId;
}
export enum StatusId {
  Open = 0,
  Todo,
  InProcess,
  InReview,
  Done
}

const { Header, Content, Sider, Footer } = Layout;
const labels = ['Board', 'Projects', 'Backlog'];

const MyMenu: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);


  const [selectedTab, setSelectedTab] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>('görev');
  const {

    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleTabChange = (e: any) => {
    //Number.parseInt(e.key)

    setSelectedTab(e.key);
    if (e.key === "2") {
      setFilterType("proje");  // Projects'e tıklanınca sadece proje gözüksün
    }
    else if (e.key === "3") {
      setFilterType("open");
    }
    else {
      setFilterType("görev");     // Diğer durumlarda hepsi görünsün
    }
  };

  const items = labels.map((label, index) => ({
    key: index + 1,
    label: label

  }));

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: '110px', height: '35px', marginRight: '16px' }}
        />

        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items}
          onClick={handleTabChange}
        />

        <Button onClick={handleOpenModal} type='primary' style={{ marginLeft: 10, backgroundColor: 'red' }}>Create</Button>
      </Header>
      <Layout>
        {/* <Sider width={65} style={{ background: '#fff' }} >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ width: '65px', borderRight: 0}}
          >
            <Menu.Item key="1" icon={<UserOutlined />} >
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
            </Menu.Item>
          </Menu>
        </Sider> */}


        <Layout>
          <Content style={{ padding: '0 10px' }}>
            <Content style={{ padding: '40px 4px 0px 4px' }}>
              <div
                style={{
                  background: '#fff',
                  minHeight: 480,
                  padding: 24,
                  borderRadius: 5,
                }}
              >
                {selectedTab == 1 ? <Kartlar /> : selectedTab == 2 ? <MyList /> : selectedTab == 3 ? <Backlog /> : null}

              </div>
            </Content>

          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>
        Ziraat Teknoloji ©{new Date().getFullYear()} Ziraat Bankası tarafından geliştirildi
      </Footer>

      <Modal
        title="Yeni Kayıt Oluştur"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <MyMiniForm veriGonder={veriGonder} />

      </Modal>

    </Layout>
  );
};

export default MyMenu;
