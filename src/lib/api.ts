import { createClient } from '@metagptx/web-sdk';

const client = createClient({
  baseURL: 'http://localhost:8000' 
});

export default client;