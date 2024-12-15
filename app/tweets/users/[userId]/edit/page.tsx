"use client";

import { handleEditForm } from "@/app/create-account/actions";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { getUser, UserResponses } from "@/service/userService";
import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/16/solid";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { useActionState, useEffect, useState } from "react";

export default function Users({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    // const { userId } = use(params);
    const [formData, setFormData] = useState<UserResponses>();
    const getUserInfo = async () => {
        const user = await getUser();
        console.log("user", user);
        if (user) setFormData(user);
    };
    const [state, action] = useActionState(handleEditForm, null);
    useEffect(() => {
        getUserInfo();
    }, [state]);

    return (
        <div>
            <h1 className="text-2xl my-4 text-center">EDIT</h1>
            <form action={action} className="w-full flex flex-col gap-5">
                <input
                    className="hidden"
                    type="hidden"
                    name="userId"
                    value={formData?.id || ""}
                    readOnly
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    defaultValue={formData?.email || ""}
                    required={true}
                    errors={state?.error?.fieldErrors.email}
                    labelIcon={<EnvelopeIcon />}
                />
                <Input
                    name="username"
                    placeholder="Username"
                    defaultValue={formData?.username || ""}
                    required={true}
                    errors={state?.error?.fieldErrors.username}
                    labelIcon={<UserIcon />}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required={true}
                    errors={state?.error?.fieldErrors.password}
                    labelIcon={<KeyIcon />}
                />
                <Input
                    name="bio"
                    type="text"
                    placeholder="bio"
                    defaultValue={formData?.bio || ""}
                    labelIcon={<DocumentTextIcon />}
                />
                <Button text="Edit Profile" />
                {state?.isSuccess && <div>수정되었습니다.</div>}
            </form>
        </div>
    );
}
