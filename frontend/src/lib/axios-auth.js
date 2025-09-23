// frontend/src/lib/axios-auth.js
import axios from 'axios';

const authAxios = axios.create({
  baseURL: 'http://localhost:8000',  // raiz do backend para /broadcasting/auth
  withCredentials: true,             // ESSENCIAL para cookies de sessão e CSRF
});

// Não precisa de interceptor aqui

export default authAxios;
