import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response
      ? error.response.data?.message || error.response.statusText
      : error.message || 'Error de conexión';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export const getData = async (endpoint) => {
  try {
    const data = await api.get(endpoint);
    return data 
  } catch (error) {
    return { data: null, error: error.message }; 
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const putData = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response
  } catch (error) {
    return { data: null, error: error.message };
  }
};
