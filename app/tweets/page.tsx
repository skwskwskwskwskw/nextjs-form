import AddTweet from "@/components/AddTweet";
import TweetsList from "@/components/TweetsList";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getTotalTweets() {
    return await db.tweet.count();
}
async function getInitialTweets() {
    const tweets = await db.tweet.findMany({
        select: {
            id: true,
            user: true,
            tweet: true,
            created_at: true,
        },
        take: 2,
        orderBy: {
            created_at: "desc",
        },
    });
    return tweets;
}

export type InitialTweets = Prisma.PromiseReturnType<typeof getInitialTweets>;

export default async function Tweets() {
    const totalTweets = await getTotalTweets();
    const initialTweets = await getInitialTweets();
    return (
        <div>
            <AddTweet />
            <TweetsList
                TotalCount={totalTweets}
                InitialTweets={initialTweets}
            />
        </div>
    );
}
