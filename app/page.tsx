import SideNavigation from "@/components/SideNavigation";
import Tweets from "./tweets/page";

export default function Home() {
    return (
        <main className="flex h-screen">
            <div className="w-1/4 p-4">
                <SideNavigation />
            </div>
            <div className="w-3/4 flex flex-col p-4">
                <Tweets />
            </div>
        </main>
    );
}
