import React from "react";
import { Card, Tag } from "antd";
import { EditOutlined, SettingOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDraggable } from "@dnd-kit/core";
import { IKart } from "../MyMenu";

interface DraggableCardProps {
  kart: IKart;
  onEdit: (kart: IKart) => void;
  onDelete: (kart: IKart) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ kart, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: kart._id,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    cursor: "grab",
  };

  return (

    <Card
      className="Card"
      title={
        <div {...listeners} style={{ cursor: "grab" }}>
          {kart.type}
        </div>
      }
      ref={setNodeRef}
      {...attributes}
      style={style}
      actions={[
        <EditOutlined key="edit" onClick={() => { console.log("tıklandııı"); onEdit(kart) }} />,
        <SettingOutlined key="setting" />,
        <DeleteOutlined key="delete" onClick={() => onDelete(kart)} />,
      ]}
    >
      <p>Görev Adı: {kart.projectName}</p>
      <p>Görev Amacı: {kart.projectGoal}</p>
      <p>Görevin Büyüklüğü: {kart.taskType ?? "Belirtilmedi"}</p>

      {kart.tags && kart.tags.length > 0 ? (
        kart.tags.map((tag: string, i: number) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "Ziraat") color = "volcano";
          if (tag === "Finans") color = "green";
          if (tag === "Ziraat Teknoloji") color = "blue";
          if (tag === "Yazılım") color = "purple";
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

  );
};

export default DraggableCard;
