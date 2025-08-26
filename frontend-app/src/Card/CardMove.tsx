import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Space, Tag, Modal, Form, Input, Radio } from 'antd';
import MyMenu, { IKart, StatusId } from "../MyMenu";

import { fetchKartlar, fetchTodo, fetchInProcess, fetchInreviev, fetchDone, updateKart } from '../Api';
import './CSS/Cards.css';
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import MyTag from '../Form/tags';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

const Kartlar: React.FC = () => {
  const [form] = Form.useForm();

  const [selectedCard, setSelectedCard] = useState<IKart | null>(null);
  const [editingCard, setEditingCard] = useState<IKart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [todoCards, setTodoCards] = useState<IKart[]>([]);
  const [inProcess, setInProcess] = useState<IKart[]>([]);
  const [inReview, setInReview] = useState<IKart[]>([]);
  const [done, setDone] = useState<IKart[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  // ✅ Edit
  const handleEdit = (kart: IKart) => {
    setEditingCard(kart);
    form.setFieldsValue(kart); // formu doldur
    setIsModalOpen(true);
  };

  // ✅ Delete
  const handleDelete = (kart: IKart) => {
    setSelectedCard(kart);
    console.log("Kart silinecek:", kart);
  };

  // ✅ Drag End (şimdilik log atalım)
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      console.log("Kart taşındı:", active.id, "=>", over.id);
      // burada updateKart ile backend'e status güncellenebilir
    }
  }

  // ✅ İlk veri çekme
  useEffect(() => {
    fetchTodo().then(setTodoCards);
    fetchInProcess().then(setInProcess);
    fetchInreviev().then(setInReview);
    fetchDone().then(setDone);
  }, []);

  return (
    <>
      {/* Kart Edit Modal */}
      <Modal
        title="Kartı Düzenle"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            if (editingCard) {
              try {
                await updateKart(editingCard._id, values);
                console.log("Kart güncellendi:", values);

                // listeyi yenile
                fetchKartlar().then((data) => {
                  console.log("Yeniden çekilen veriler:", data);
                });
              } catch (error) {
                console.error("Kart güncellenirken hata:", error);
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

      <h3 className="h3">Talepler</h3>
      <hr />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Row gutter={16}>
          {/* To Do */}
          <Col span={6}>
            <h3 className="h3">To Do</h3>
            <div className="space-style">
              <Space direction="vertical" size="middle">
                {todoCards.map((kart) => (
                  <Card
                    className="Card"
                    key={kart._id}
                    title={kart.type}
                    actions={[
                      <EditOutlined key="edit" onClick={() => handleEdit(kart)} />,
                      <SettingOutlined key="setting" />,
                      <DeleteOutlined key="delete" onClick={() => handleDelete(kart)} />,
                    ]}
                  >
                    <p>Görev Adı: {kart.projectName}</p>
                    <p>Görev Amacı: {kart.projectGoal}</p>
                    <p>Görevin Büyüklüğü: {kart.taskType ?? 'Belirtilmedi'}</p>

                    {kart.tags && kart.tags.length > 0 ? (
                      kart.tags.map((tag: string, i: number) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'Ziraat') color = 'volcano';
                        if (tag === 'Finans') color = 'green';
                        if (tag === 'Ziraat Teknoloji') color = 'blue';
                        if (tag === 'Yazılım') color = 'purple';
                        return (
                          <Tag color={color} key={i}>
                            {tag}
                          </Tag>
                        );
                      })
                    ) : (
                      <p>Belirtilmedi</p>
                    )}
                  </Card>
                ))}
              </Space>
            </div>
          </Col>

          {/* In Process */}
          <Col span={6}>
            <h3 className="h3">In Process</h3>
            <div className="space-style">
              <Space direction="vertical" size="middle">
                {inProcess.map((kart) => (
                  <Card className="Card" key={kart._id} title={kart.type}>
                    <p>Görev Adı: {kart.projectName}</p>
                    <p>Görev Amacı: {kart.projectGoal}</p>
                  </Card>
                ))}
              </Space>
            </div>
          </Col>

          {/* In Review */}
          <Col span={6}>
            <h3 className="h3">In Review</h3>
            <div className="space-style">
              <Space direction="vertical" size="middle">
                {inReview.map((kart) => (
                  <Card className="Card" key={kart._id} title={kart.type}>
                    <p>Görev Adı: {kart.projectName}</p>
                    <p>Görev Amacı: {kart.projectGoal}</p>
                  </Card>
                ))}
              </Space>
            </div>
          </Col>

          {/* Done */}
          <Col span={6}>
            <h3 className="h3">Done</h3>
            <div className="space-style">
              <Space direction="vertical" size="middle">
                {done.map((kart) => (
                  <Card className="Card" key={kart._id} title={kart.type}>
                    <p>Görev Adı: {kart.projectName}</p>
                    <p>Görev Amacı: {kart.projectGoal}</p>
                  </Card>
                ))}
              </Space>
            </div>
          </Col>
        </Row>
      </DndContext>
    </>
  );
};

export default Kartlar;