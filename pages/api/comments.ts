import { NextApiRequest, NextApiResponse } from 'next';

import serverAuth from '@/libs/serverAuth';
import prisma from '@/libs/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const authResult = await serverAuth(req, res);

    if (authResult.error) {
      // Handle the authentication error, e.g., return a specific response
      return res.status(401).json({ error: authResult.error });
    }

    const { currentUser } = authResult;
    const { body } = req.body;
    const { postId } = req.query;

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }
    if (!currentUser) {
      // Handle the case where currentUser is undefined
      return res.status(401).json({ error: 'User not found' });
    }
    const comment = await prisma.comment.create({
      data: {
        body,
        userId: currentUser.id,
        postId,
      },
    });

    // NOTIFICATION PART START
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post?.userId) {
        await prisma.notification.create({
          data: {
            body: 'Someone replied on your tweet!',
            userId: post.userId,
          },
        });

        await prisma.user.update({
          where: {
            id: post.userId,
          },
          data: {
            hasNotification: true,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
    // NOTIFICATION PART END

    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
