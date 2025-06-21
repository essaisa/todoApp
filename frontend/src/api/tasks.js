import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080', // Flask server
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getTasks = (status) => API.get(`/tasks?status=${status}`);
export const getUpcoming = () => API.get('/tasks/upcoming');
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
