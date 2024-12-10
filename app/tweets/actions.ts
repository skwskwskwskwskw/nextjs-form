"use server";

import { z } from "zod";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

const LIMIT_NUMBER = 2;
export type InitialTweets = Prisma.PromiseReturnType<typeof getInitialTweets>;

export async function getTotalTweets() {
    return await db.tweet.count();
}

export async function getInitialTweets() {
    const tweets = await db.tweet.findMany({
        select: {
            id: true,
            user: true,
            content: true,
            created_at: true,
        },
        take: LIMIT_NUMBER,
        orderBy: {
            created_at: "desc",
        },
    });
    return tweets;
}

const addTweetSchema = z.object({
    content: z
        .string({
            required_error: "Text is required.",
        })
        .trim(),
});

export async function getMoreTweets(page: number) {
    const tweets = await db.tweet.findMany({
        select: {
            id: true,
            user: true,
            content: true,
            created_at: true,
        },
        skip: LIMIT_NUMBER * page,
        take: LIMIT_NUMBER,
        orderBy: {
            created_at: "desc",
        },
    });
    return tweets;
}

export async function handleAddTweetForm(
    _: unknown,
    formData: FormData
) {
    const session = await getSession();
    const data = {
        content: formData.get("content"),
    };
    const result = await addTweetSchema.spa(data);
    if (!result.success) {
        return {
            error: result.error?.flatten(),
            isSuccess: false,
        };
    }

    if(session.id) {
        const addNewTweet = await db.tweet.create({
            data: { content: result.data.content, userId: session.id },
        });
        if (!addNewTweet) {
            return {
                error: {
                    formErrors: [],
                    fieldErrors: {
                        content: ["Error"],
                    },
                },
                isSuccess: false,
            };
        } else {
            redirect(`/tweets/${addNewTweet.id}`);
        }
    }  
}
