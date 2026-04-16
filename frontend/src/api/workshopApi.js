import http from './http';

export const loginRequest = async (payload) => {
  const { data } = await http.post('/auth/login', payload);
  return data;
};

export const refreshAccessToken = async (refreshToken) => {
  const { data } = await http.post('/auth/refresh', { refreshToken });
  return data;
};

export const logoutRequest = async (refreshToken) => {
  const { data } = await http.post('/auth/logout', { refreshToken });
  return data;
};

export const getMe = async () => {
  const { data } = await http.get('/auth/me');
  return data;
};

export const adminCreateUser = async (payload) => {
  const { data } = await http.post('/auth/register', payload);
  return data;
};

export const adminListUsers = async () => {
  const { data } = await http.get('/auth/users');
  return data;
};

export const adminUpdateUser = async (id, payload) => {
  const { data } = await http.patch(`/auth/users/${id}`, payload);
  return data;
};

export const listWorkOrders = async ({ status = '', plate = '', page = 1, pageSize = 10 }) => {
  const { data } = await http.get('/work-orders', { params: { status, plate, page, pageSize } });
  return data;
};

export const getWorkOrder = async (id) => {
  const { data } = await http.get(`/work-orders/${id}`);
  return data;
};

export const createWorkOrder = async (payload) => {
  const { data } = await http.post('/work-orders', payload);
  return data;
};

export const updateWorkOrderStatus = async (id, status, note = '') => {
  const { data } = await http.patch(`/work-orders/${id}/status`, { status, note });
  return data;
};

export const getWorkOrderHistory = async (id) => {
  const { data } = await http.get(`/work-orders/${id}/history`);
  return data;
};

export const addWorkOrderItem = async (id, payload) => {
  const { data } = await http.post(`/work-orders/${id}/items`, payload);
  return data;
};

export const deleteWorkOrderItem = async (itemId) => {
  const { data } = await http.delete(`/work-orders/items/${itemId}`);
  return data;
};

export const listBikes = async ({ plate = '', page = 1, pageSize = 20 }) => {
  const { data } = await http.get('/bikes', { params: { plate, page, pageSize } });
  return data;
};

export const createBike = async (payload) => {
  const { data } = await http.post('/bikes', payload);
  return data;
};

export const listClients = async ({ search = '', page = 1, pageSize = 20 }) => {
  const { data } = await http.get('/clients', { params: { search, page, pageSize } });
  return data;
};

export const createClient = async (payload) => {
  const { data } = await http.post('/clients', payload);
  return data;
};
