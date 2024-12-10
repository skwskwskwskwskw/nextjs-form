"use client";

import { useActionState } from "react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";
import Button from "./Button";
import Input from "./Input";
import { handleAddTweetForm } from "@/app/tweets/actions";

export default function AddTweet() {
    const [state, dispatch] = useActionState(handleAddTweetForm, null);

    return (
        <div>
            <form action={dispatch} className="w-full flex gap-5">
                <div className="w-[500px]">
                    <Input
                        name="content"
                        type="text"
                        placeholder="새 트윗 작성하기"
                        required
                        errors={state?.error?.fieldErrors.content}
                        labelIcon={<ChatBubbleBottomCenterTextIcon />}
                    />
                </div>
                <div className="w-[100px]">
                    <Button text="작성하기" />
                </div>
            </form>
        </div>
    );
}
