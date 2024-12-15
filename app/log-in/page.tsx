"use client";

import { FireIcon, EnvelopeIcon, KeyIcon } from "@heroicons/react/24/solid";
import { useActionState } from "react";
import { handleForm } from "./actions";

import Input from "@/components/Input";
import Button from "@/components/Button";
import SuccessMessage from "@/components/SuccessMsg";
import Link from "next/link";

export default function Login() {
    const [state, dispatch] = useActionState(handleForm, null);

    return (
        <main className="flex flex-col gap-10 items-center justify-center">
            <h1 className="text-center text-6xl mt-20">
                <FireIcon className="size-20 text-red-400" />
            </h1>
            <form action={dispatch} className="w-full flex flex-col gap-5">
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    errors={state?.error?.fieldErrors.email}
                    labelIcon={<EnvelopeIcon />}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    errors={state?.error?.fieldErrors.password}
                    labelIcon={<KeyIcon />}
                />
                <Button text="Log in" />
                {state?.isSuccess && <SuccessMessage />}
            </form>
            <div className="flex gap-2">
                <span>처음이신가요?</span>
                <Link
                    href="/create-account"
                    className="text-stone-600 hover:underline hover:text-stone-400"
                >
                    Create Account
                </Link>
            </div>
        </main>
    );
}
