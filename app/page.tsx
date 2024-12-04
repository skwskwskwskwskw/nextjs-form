import { notFound } from "next/navigation";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";

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
        <main className="flex flex-col gap-20 items-center justify-center">
            <h1 className="mt-10 text-xl font-bold">
                Welcome! {user?.username}!
            </h1>
            <Tweets />
        </main>
    );
}
