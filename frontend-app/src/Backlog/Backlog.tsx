import React, { useState, useRef, useEffect, useCallback } from 'react';
import Mytask from "./Backlog_TaskSection";
import { IKart, StatusId } from "../MyMenu";
import { Collapse } from 'antd';
import { fetchKartlar, fetchTodo, veriGonder } from '../Api';


const { Panel } = Collapse;
const Backlog: React.FC<any> = () => {
  const [kartlar, setKartlar] = useState<IKart[]>([]);
  const [ToDo, setToDo] = useState<IKart[]>([]);

  useEffect(() => {
    fetchKartlar().then((data) => {
      setKartlar(data);
    });
    fetchTodo().then((data) => {
      setToDo(data);
    });
  }, []);
  
  return (
    <div style={{ display: "vertical", gap: "20px" }}>
      {/* İlk tablo */}
      <h2>Backlog</h2>

      <Collapse accordion defaultActiveKey={['1']}>
        <Panel header="Open" key="1" >
          <>

            <h4>Bekleyen Görevler</h4>
            <Mytask data={kartlar}  status={StatusId.Open} />
          </>
        </Panel>

      </Collapse>

      {/* İkinci tablo */}

      <Collapse accordion defaultActiveKey={['2']}>
        <Panel header="To Do" key="2">
          <h4>Onaylanan Görevler</h4>
          <Mytask data={ToDo} status={StatusId.Todo} />
          </Panel>
      </Collapse>

    </div>
  );
};

export default Backlog;
