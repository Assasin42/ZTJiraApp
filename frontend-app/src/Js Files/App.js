import React from 'react';
import Kartlar from '../Card/Cards';
import MyMenu from '../MyMenu';
import {DndContext} from '@dnd-kit/core';
import { message } from "antd";
import Login from '../Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from "../Login/Register";



function App() {
  
 return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<MyMenu />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
