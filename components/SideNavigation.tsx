import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getUser } from "@/service/userService";
import { destroySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Button from "./Button";

export default async function SideNavigation() {
    const user = await getUser();
    const logOut = async () => {
        "use server";
        destroySession();
        redirect("/");
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <ul className="flex flex-col gap-5 mt-5">
                <Link href="/">
                    <li className="flex gap-4 hover:text-blue-400">
                        <HomeIcon className="size-6" /> HOME
                    </li>
                </Link>
                <Link href="/search">
                    <li className="flex gap-4 hover:text-blue-400">
                        <MagnifyingGlassIcon className="size-6" /> SEARCH
                    </li>
                </Link>
            </ul>
            {user ? (
                <div className="mb-5">
                    Hello, {user?.username}!
                    <form className="mt-2" action={logOut}>
                        <Button text="Logout" />
                    </form>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
