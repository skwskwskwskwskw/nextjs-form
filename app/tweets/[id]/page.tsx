import { getSession } from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import { getTweet } from "./actions";
import { unstable_cache as nextCache } from "next/cache";
import LikeButton from "@/components/LikeButton";
import Responses from "@/components/Responses";
import { getLikeStatus } from "@/service/likeService";
import { getInitialResponse } from "@/service/responseService";
import Link from "next/link";

async function getCachedLikeStatus(tweetId: number) {
    const session = await getSession();
    const cachedLikeStatus = nextCache(getLikeStatus, ["tweet-like-status"], {
        tags: [`like-status-${tweetId}`],
    });
    return cachedLikeStatus(tweetId, session.id!);
}

async function getCachedResponses(tweetId: number) {
    const cachedComments = nextCache(getInitialResponse, ["tweet-responses"], {
        tags: [`tweet-responses-${tweetId}`],
    });
    return cachedComments(tweetId);
}

export default async function TweetsDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // const id = Number(params.id);
    const { id } = await params;
    const tweetId = Number(id);
    if (isNaN(tweetId)) {
        return notFound();
    }
    const tweet = await getTweet(tweetId);
    if (!tweet) {
        return notFound();
    }
    const responses = await getCachedResponses(tweetId);
    const { isLiked, likeCount } = await getCachedLikeStatus(tweetId);
    return (
        <div className="w-full">
            <div className="p-5 items-center gap-3 border-b border-neutral-700">
                <Link
                    href={`users/${tweet.userId}`}
                    className="flex items-center gap-4 hover:text-blue-400"
                >
                    <div className="size-10 overflow-hidden rounded-full">
                        <UserIcon />
                    </div>
                    <div>
                        <h3>{tweet.user.username}</h3>
                    </div>
                </Link>
            </div>
            <div className="p-5">
                <h1 className="text-xl font-semibold">{tweet.content}</h1>
                <div className="text-xs mt-16">
                    {tweet.created_at.toString()}
                </div>
            </div>
            <div className="w-full flex flex-col gap-5 mt-10">
                <LikeButton
                    isLiked={isLiked}
                    likeCount={likeCount}
                    tweetId={tweetId}
                />
                <Responses
                    initialResponses={responses}
                    tweetId={tweetId}
                    username={tweet.user.username}
                />
            </div>
        </div>
    );
}
