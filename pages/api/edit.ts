import { NextApiRequest, NextApiResponse } from 'next';

import serverAuth from '@/libs/serverAuth';
import prisma from '@/libs/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    return res.status(405).end();
  }

  try {
    const authResult = await serverAuth(req, res);

    if (authResult.error) {
      // Handle the authentication error, e.g., return a specific response
      return res.status(401).json({ error: authResult.error });
    }

    const { currentUser } = authResult;

    const { name, username, bio, profileImage, coverImage } = req.body;

    if (!name || !username) {
      throw new Error('Missing fields');
    }

    if (!currentUser) {
      // Handle the case where currentUser is undefined
      return res.status(401).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
