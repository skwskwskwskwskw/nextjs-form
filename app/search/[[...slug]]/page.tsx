import {
    getInitialSearchTweets,
    getTotalSearchTweets,
} from "@/app/tweets/actions";
import Search from "@/components/Search";
import SideNavigation from "@/components/SideNavigation";
import TweetsList from "@/components/TweetsList";

export default async function SearchPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    let totalSearchTweets = null;
    let initialSearchTweets = null;
    let keyword = "";
    const slug = (await params).slug;
    if (slug) {
        keyword = decodeURIComponent(slug[0]);
        totalSearchTweets = await getTotalSearchTweets(keyword);
        initialSearchTweets = await getInitialSearchTweets(keyword);
    }

    return (
        <main className="flex h-screen">
            <div className="flex-none w-1/4 p-4">
                <SideNavigation />
            </div>
            <div className="w-3/4 p-4 flex flex-col">
                <Search />
                {slug ? (
                    <div>
                        <h2>{keyword} 검색결과 </h2>
                        {totalSearchTweets && initialSearchTweets && (
                            <TweetsList
                                TotalCount={totalSearchTweets}
                                InitialTweets={initialSearchTweets}
                            />
                        )}
                    </div>
                ) : (
                    ""
                )}
            </div>
        </main>
    );
}
