"use client";

import { useEffect, useState } from "react";
import { getMoreTweets, InitialTweets } from "@/app/tweets/actions";
import Link from "next/link";
import { formatToTimeAgo } from "@/lib/utils";

interface TweetsListProps {
    TotalCount: number;
    InitialTweets: InitialTweets;
}

export default function TweetsList({
    TotalCount,
    InitialTweets,
}: TweetsListProps) {
    const [tweets, setTweets] = useState(InitialTweets);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(InitialTweets.length >= TotalCount);

    useEffect(() => {
        if(tweets.length === TotalCount) setIsLastPage(true);
    }, [tweets.length, TotalCount]);

    const onLoadMoreClick = async () => {
        setIsLoading(true);
        const newTweets = await getMoreTweets(page + 1);
        if (newTweets) {
            setPage((prev) => prev + 1);
            setTweets((prev) => [...prev, ...newTweets]);
            if (tweets.length + newTweets.length >= TotalCount) {
                setIsLastPage(true);
            }
        }
        setIsLoading(false);
    };
    return (
        <div className="p-5 flex flex-col gap-5">
            {tweets.map((tweet) => (
                <Link
                    href={`/tweets/${tweet.id}`}
                    className="flex gap-5"
                    key={tweet.id}
                >
                    <div className="flex flex-col gap-1 *:text-white">
                        <span className="text-lg">{tweet.content}</span>
                        <span className="text-sm text-neutral-500">
                            {formatToTimeAgo(tweet.created_at.toString())}
                        </span>
                    </div>
                </Link>
            ))}
            {isLastPage ? (
                "No more items"
            ) : (
                <button
                    onClick={onLoadMoreClick}
                    disabled={isLoading}
                    className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
                >
                    {isLoading ? "로딩 중" : "Load more"}
                </button>
            )}
        </div>
    );
}
