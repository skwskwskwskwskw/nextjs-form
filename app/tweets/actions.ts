"use server";

import db from "@/lib/db";

export async function getMoreTweets(page: number) {
    const tweets = await db.tweet.findMany({
        select: {
            id: true,
            user: true,
            tweet: true,
            created_at: true,
        },
        skip: page * 2,
        take: 2,
        orderBy: {
            created_at: "desc",
        },
    });
    return tweets;
}
