"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";

export const getLikeStatus = async (tweetId: number, userId: number) => {
  const like = await db.like.findUnique({
    where: {
      id: {
        userId,
        tweetId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      tweetId,
    },
  });
  return {
    isLiked: Boolean(like),
    likeCount,
  };
};

export const likeTweet = async (tweetId: number) => {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        userId: session.id!,
        tweetId,
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (error) {
    console.error(error);
  }
};
export const dislikeTweet = async (tweetId: number) => {
  const session = await getSession();
  try {
    await db.like.delete({
      where: {
        id: { userId: session.id!, tweetId },
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (error) {
    console.error(error);
  }
};