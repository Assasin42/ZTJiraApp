import React, { useEffect, useState } from "react";
import { Row, Modal, Form, Input, Radio } from "antd";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { IKart, StatusId } from "./MyMenu";
import { fetchTodo, fetchInProcess, fetchInreviev, fetchDone, updateKart, fixKart, deleteKart } from "./Api";
import MyTag from "./Form/tags";
import DraggableCard from "./Dnd-kit/DraggableCard";
import DroppableColumn from "./Dnd-kit/DroppableColumn";
import "./CSS/Cards.css";

const Kartlar: React.FC = () => {
  const [form] = Form.useForm();
  const [editingCard, setEditingCard] = useState<IKart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [todoCards, setTodoCards] = useState<IKart[]>([]);
  const [inProcess, setInProcess] = useState<IKart[]>([]);
  const [inReview, setInReview] = useState<IKart[]>([]);
  const [done, setDone] = useState<IKart[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  const loadPage=()=>{
    fetchTodo().then(setTodoCards);
      fetchInProcess().then(setInProcess);
      fetchInreviev().then(setInReview);
      fetchDone().then(setDone);
  }
  const handleEdit = (kart: IKart) => {
    setEditingCard(kart);
    form.setFieldsValue(kart);
    setIsModalOpen(true);
  };

  const handleDelete = (kart: IKart) => {
    deleteKart(kart._id).then(() => {
      loadPage();
    }).catch((err) => console.error(err));
  };

  function handleDragEnd(event: any) {
    
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id;
    const newStatusNumber = Number(over.id);

    let draggedKart: IKart | undefined;
    let sourceArray: IKart[] = [];

    if (todoCards.find((k) => k._id === draggedId)) sourceArray = todoCards;
    else if (inProcess.find((k) => k._id === draggedId)) sourceArray = inProcess;
    else if (inReview.find((k) => k._id === draggedId)) sourceArray = inReview;
    else if (done.find((k) => k._id === draggedId)) sourceArray = done;

    draggedKart = sourceArray.find((k) => k._id === draggedId);
    if (!draggedKart || draggedKart.status == newStatusNumber) return;

    const newSourceArray = sourceArray.filter((k) => k._id !== draggedId);
    const newKart = { ...draggedKart, status: newStatusNumber };

    if (newStatusNumber === StatusId.Todo) setTodoCards((prev) => [...prev, newKart]);
    else if (newStatusNumber === StatusId.InProcess) setInProcess((prev) => [...prev, newKart]);
    else if (newStatusNumber === StatusId.InReview) setInReview((prev) => [...prev, newKart]);
    else if (newStatusNumber === StatusId.Done) setDone((prev) => [...prev, newKart]);

    if (sourceArray === todoCards) setTodoCards(newSourceArray);
    else if (sourceArray === inProcess) setInProcess(newSourceArray);
    else if (sourceArray === inReview) setInReview(newSourceArray);
    else if (sourceArray === done) setDone(newSourceArray);

    fixKart(draggedId, { status: newStatusNumber }).catch((err) => console.error(err));
  }

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <>
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
              await updateKart(editingCard._id, values);
              loadPage();
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
          <DroppableColumn id={StatusId.Todo} title="To Do">
            {todoCards.map((kart) => (
              <DraggableCard key={kart._id} kart={kart} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </DroppableColumn>

          <DroppableColumn id={StatusId.InProcess} title="In Process">
            {inProcess.map((kart) => (
              <DraggableCard key={kart._id} kart={kart} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </DroppableColumn>

          <DroppableColumn id={StatusId.InReview} title="In Review">
            {inReview.map((kart) => (
              <DraggableCard key={kart._id} kart={kart} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </DroppableColumn>

          <DroppableColumn id={StatusId.Done} title="Done">
            {done.map((kart) => (
              <DraggableCard key={kart._id} kart={kart} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </DroppableColumn>
        </Row>
      </DndContext>
    </>
  );
};

export default Kartlar;
