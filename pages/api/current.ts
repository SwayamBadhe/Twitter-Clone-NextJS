import { NextApiRequest, NextApiResponse } from 'next';

import serverAuth from '@/libs/serverAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const authResult = await serverAuth(req, res);

    if (authResult.error) {
      // Handle the authentication error, e.g., return a specific response
      return res.status(401).json({ error: authResult.error });
    }

    const { currentUser } = authResult;

    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
