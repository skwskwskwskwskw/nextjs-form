"use server";

import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { responseSchema } from "@/lib/schema";

export const getInitialResponse = async (tweetId: number) => {
  const responses = await db.response.findMany({
    where: {
      tweetId,
    },
    select: {
      id: true,
      content: true,
      created_at: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return responses;
};
export type InitialResponses = Prisma.PromiseReturnType<typeof getInitialResponse>;

export const addTweetResponse = async (formData: FormData) => {
  const text = formData.get("text");
  const tweetId = formData.get("tweetId");
  const result = responseSchema.safeParse(text);
  if (!result.success) {
    return { error: result.error.flatten(), isSuccess: false };
  }
  const session = await getSession();
  try {
    if (session.id) {
      await db.response.create({
        data: {
          userId: session.id,
          tweetId: Number(tweetId),
          content: result.data,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
  revalidateTag(`tweet-responses-${tweetId}`);
};