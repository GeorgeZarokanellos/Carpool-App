import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.1.3:3000/api/v1',
  // baseURL: 'http://localhost:3000/api/v1',
  // baseURL: 'https://zarokanellos.imslab.gr/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'  
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('No token found'); 
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


//interceptor to redirect to login page if response code is 401
instance.interceptors.response.use(
  response => response,
  error => {
    if(error.response && error.response.status === 401){
      if(window.location.pathname !== '/'){
        window.location.href = '/';
      }
    } 
    return Promise.reject(error);
  }
)


export default instance;