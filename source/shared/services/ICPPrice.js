import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.nomics.com/v1',
  timeout: 15000,
});

export default async () => api.get('/currencies/ticker', {
  params: {
    key: '4a682504e662099992184db0b396fdec8f3feab9',
    ids: 'ICP',
    interval: '1h',
  },
});
