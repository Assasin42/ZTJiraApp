import React from "react";
import { Col, Space } from "antd";
import { useDroppable } from "@dnd-kit/core";

interface DroppableColumnProps {
  id: number;
  title: string;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, title, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Col span={6}>
      <h3 className="h3">{title}</h3>
      <div ref={setNodeRef} className="space-style">
        <Space direction="vertical" size="middle">
          {children}
        </Space>
      </div>
    </Col>
  );
};

export default DroppableColumn;
