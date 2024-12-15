"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";

export const isEmailExist = async (email: string): Promise<boolean> => {
    const user = await db.user.findUnique({
        where: { email },
        select: { id: true },
    });
    return Boolean(user);
};

export const isUsernameExist = async (username: string): Promise<boolean> => {
    const user = await db.user.findUnique({
        where: { username },
        select: { id: true },
    });
    return Boolean(user);
};

export const getUser = async () => {
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
};

export type UserResponses = Prisma.PromiseReturnType<typeof getUser>;
