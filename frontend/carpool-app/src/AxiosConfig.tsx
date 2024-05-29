import axios from 'axios';
import { useHistory } from 'react-router';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_here',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  response => response,
  error => {
    if(error.response && error.response.status === 401){
      window.location.href = '/';
    } 
    return Promise.reject(error);
  }
)


export default instance;