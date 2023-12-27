import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/libs/prismadb';
import serverAuth from '@/libs/serverAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).end();
  }

  try {
    const { postId } = req.body;

    const authResult = await serverAuth(req, res);

    if (authResult.error) {
      // Handle the authentication error, e.g., return a specific response
      return res.status(401).json({ error: authResult.error });
    }

    const { currentUser } = authResult;

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error('Invalid ID');
    }

    if (!currentUser) {
      // Handle the case where currentUser is undefined
      return res.status(401).json({ error: 'User not found' });
    }

    let updatedlikeIds = [...(post.likeIds || [])];

    if (req.method === 'POST') {
      updatedlikeIds.push(currentUser.id);

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
              body: 'Someone liked your tweet!',
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
    }

    if (req.method === 'DELETE') {
      updatedlikeIds = updatedlikeIds.filter(
        (likedId) => likedId !== currentUser?.id
      );
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likeIds: updatedlikeIds,
      },
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
