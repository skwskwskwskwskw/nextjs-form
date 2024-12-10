import AddTweet from "@/components/AddTweet";
import TweetsList from "@/components/TweetsList";
import { getInitialTweets, getTotalTweets } from "./actions";

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
