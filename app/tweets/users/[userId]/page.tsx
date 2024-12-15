import { notFound } from "next/navigation";
import { getIsOwner } from "@/lib/session";
import Button from "@/components/Button";
import { getUser } from "@/service/userService";
import { UserIcon } from "@heroicons/react/24/outline";
import {
    CalendarDaysIcon,
    DocumentTextIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { getInitialUserTweets, getTotalUserTweets } from "../../actions";
import TweetsList from "@/components/TweetsList";
import Link from "next/link";

export default async function Users({
    params,
}: {
    params: { userId: string };
}) {
    const user = await getUser();
    const userId = Number(params.userId);
    if (isNaN(userId)) {
        return notFound();
    }
    const isOwner = await getIsOwner(userId);
    const totalUserTweets = await getTotalUserTweets(userId);
    const initialUserTweets = await getInitialUserTweets(userId);
    return (
        <div className="*:flex *:gap-4 *:pb-5">
            <div className="w-full items-center border-b border-neutral-700">
                <div className="size-10 overflow-hidden rounded-full">
                    <UserIcon />
                </div>
                <div>
                    <h3>{user?.username}</h3>
                </div>
                {isOwner ? (
                    <div className="w-[100px] ml-auto">
                        <Link href={`${userId}/edit`}>
                            <Button text="Edit" />
                        </Link>
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div className="mt-10">
                <EnvelopeIcon className="size-5 text-blue-400" /> {user?.email}
            </div>
            <div>
                <CalendarDaysIcon className="size-5 text-blue-400" />
                {user?.created_at.toString()}
            </div>
            <div>
                <DocumentTextIcon className="size-5 text-blue-400" />
                {user?.bio ?? "-"}
            </div>
            <div className="mt-5 border-t border-neutral-700">
                <TweetsList
                    TotalCount={totalUserTweets}
                    InitialTweets={initialUserTweets}
                />
            </div>
        </div>
    );
}
