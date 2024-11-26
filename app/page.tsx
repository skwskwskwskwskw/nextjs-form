"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { useFormState } from "react-dom";
import { handleForm } from "./action";

export default function Home() {
    const [state, action] = useFormState(handleForm, null);
    console.log("state", state);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium mt-32">
                <h1 className="text-2xl m-auto">☃️</h1>
            </div>
            <form action={action} className="flex flex-col gap-4">
                <FormInput
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    errors={[]}
                />
                <FormInput
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    errors={[]}
                />
                <FormInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    errors={state?.errors ?? []}
                />
                <FormButton text="Login" />
                {state?.success ? (
                    <div className="flex justify-center font-semibold w-full m-auto text-white bg-green-500 p-2 rounded-xl">
                        {state?.success}
                    </div>
                ) : (
                    ""
                )}
            </form>
        </div>
    );
}
