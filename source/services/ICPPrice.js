import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 15000,
});

export default async () => api.get('/simple/price', {
  params: {
    ids: 'internet-computer',
    vs_currencies: 'usd',
  },
});
