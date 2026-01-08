import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get family tree data
      const data = await kv.get('familyTree');
      res.status(200).json(data || []);
    } 
    else if (req.method === 'POST') {
      // Save family tree data
      const { people } = req.body;
      await kv.set('familyTree', people);
      res.status(200).json({ success: true });
    }
    else if (req.method === 'DELETE') {
      // Clear all data
      await kv.del('familyTree');
      res.status(200).json({ success: true });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
