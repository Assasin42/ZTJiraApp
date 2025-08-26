import axios from "axios";
import { IKart, StatusId } from "./MyMenu"; // Artık IKart MyMenu'den geliyor
import message from "antd/es/message";

// Tüm kartları çek
export const fetchKartlar = async () => {
  const res = await axios.get("http://localhost:3001/api/backlogcards");
  return res.data;
};

// Status bazlı kartlar
export const fetchTodo = async () => {
  const res = await axios.get("http://localhost:3001/api/todoCards");
  return res.data;
};

export const fetchInProcess = async () => {
  const res = await axios.get("http://localhost:3001/api/InprocessCards");
  return res.data;
};

export const fetchInreviev = async () => {
  const res = await axios.get("http://localhost:3001/api/InreviewCards");
  return res.data;
};

export const fetchDone = async () => {
  const res = await axios.get("http://localhost:3001/api/DoneCards");
  return res.data;
};

// Projeleri çek
export const fetchProjeler = async () => {
  const res = await axios.get("http://localhost:3001/api/projects");
  return res.data;
};

// Kart güncelle
export const updateKart = async (id: number, data: Partial<IKart>) => {
  const response = await axios.put(`http://localhost:3001/api/card/${id}`, data);
  return response.data;
};
export const fixKart = async (id: number, data: Partial<IKart>) => {
  const response = await axios.put(`http://localhost:3001/api/fixcard/${id}`, data);
  return response.data;
};
export const deleteKart = async (id: number) => {
  const response = await axios.delete(`http://localhost:3001/api/cart/${id}`);
  return response.data;
};
// Proje güncelle
export const updateproject = async (id: number, data: Partial<IKart>) => {
  const response = await axios.put(`http://localhost:3001/api/projects/${id}`, data);
  return response.data;
};

// Yeni kart gönder
export const veriGonder = async (formData: any) => {
  const postData = { ...formData, status: StatusId.Open };
  const res = await axios.post("http://localhost:3001/api/card", postData);

  // Gönderilen statüye göre verileri güncelle
  switch (postData.status) {
    case StatusId.Open:
      fetchKartlar();
      break;
    case StatusId.Todo:
      fetchTodo();
      break;
    case StatusId.InProcess:
      fetchInProcess();
      break;
    case StatusId.InReview:
      fetchInreviev();
      break;
    case StatusId.Done:
      fetchDone();
      break;
    default:
      fetchProjeler();
  }

  return res.data;
};
