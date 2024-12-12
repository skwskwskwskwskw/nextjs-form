import { notFound } from "next/navigation";
import db from "@/lib/db";
import { getSession } from "@/lib/session";

import Tweets from "./tweets/page";

async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
        });
        if (user) {
            return user;
        }
    }
    notFound();
}

export default async function Home() {
    const user = await getUser();
    return (
        <main className="flex flex-col gap-20 justify-center">
            {user ? (
                <h3 className="mt-10 text-sm font-bold ml-auto">
                    {user?.username}
                </h3>
            ) : ""}
            <Tweets />
        </main>
    );
}
