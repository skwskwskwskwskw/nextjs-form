import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const getSession = async () => {
    return await getIronSession<{ id?: number }>(await cookies(), {
        cookieName: "carrot-market",
        password: process.env.COOKIE_PASSWORD!,
    });
};
export const destroySession = async () => {
    const session = await getSession();
    session.destroy();
};
export async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    }
    return false;
}
