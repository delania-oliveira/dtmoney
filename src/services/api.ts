import axios from 'axios';

export const api = axios.create({
  // criar uma instancia para setar informações da api
  baseURL: 'https://localhost:3000/api/',

})