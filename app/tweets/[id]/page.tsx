
import { getSession } from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import { getTweet } from "./actions";
import { unstable_cache as nextCache } from "next/cache";
import LikeButton from "@/components/LikeButton";
import Responses from "@/components/Responses";
import { getLikeStatus } from "@/service/likeService";
import { getInitialResponse } from "@/service/responseService";

export async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    }
    return false;
}

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
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const tweet = await getTweet(id);
    if (!tweet) {
        return notFound();
    }
    const responses = await getCachedResponses(id);
    const { isLiked, likeCount } = await getCachedLikeStatus(id);
    // const isOwner = await getIsOwner(tweet.userId);
    return (
        <div className="w-full">
            <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 overflow-hidden rounded-full">
                    <UserIcon />
                </div>
                <div>
                    <h3>{tweet.user.username}</h3>
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-xl font-semibold">{tweet.content}</h1>
            </div>
            <div className="text-xs">{tweet.created_at.toString()}</div>
            <div className="text-xs">{tweet.updated_at.toString()}</div>

            <div className="w-full flex flex-col gap-5 mt-10">
                <LikeButton isLiked={isLiked} likeCount={likeCount} tweetId={id} />
                <Responses initialResponses={responses} tweetId={id} username={tweet.user.username} />
            </div>
        </div>
    );
}
