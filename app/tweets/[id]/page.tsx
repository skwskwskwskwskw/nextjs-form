
import { getSession } from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import { getTweet } from "./actions";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

export async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    }
    return false;
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
    const isOwner = await getIsOwner(tweet.userId);
    return (
        <div>
            <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 overflow-hidden rounded-full">
                    <UserIcon />
                </div>
                <div>
                    <h3>{tweet.user.username}</h3>
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-2xl font-semibold">{tweet.content}</h1>
            </div>
            <div>{tweet.created_at.toString()}</div>
            <div>{tweet.updated_at.toString()}</div>
        </div>
    );
}
