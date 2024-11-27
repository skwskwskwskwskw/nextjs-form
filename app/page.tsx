"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { handleForm } from "./action";

const initialState = {
    success: false,
    error: undefined,
};

export default function Home() {
    const [state, dispatch] = useFormState(handleForm, initialState);
    console.log("state", state);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium mt-32">
                <h1 className="text-2xl m-auto">☃️</h1>
            </div>
            <form action={dispatch} className="flex flex-col gap-4">
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    errors={state?.error?.fieldErrors.email}
                />
                <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    errors={state?.error?.fieldErrors.username}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    errors={state?.error?.fieldErrors.password}
                />
                <Button text="Login" />
                {state?.success ? (
                    <div className="flex justify-center font-semibold w-full m-auto text-white bg-green-500 p-2 rounded-xl">
                        Welcome!
                    </div>
                ) : (
                    ""
                )}
            </form>
        </div>
    );
}
