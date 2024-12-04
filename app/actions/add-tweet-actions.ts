"use server";

import { typeToFlattenedError, z } from "zod";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const addTweetSchema = z.object({
    tweet: z
        .string({
            required_error: "Text is required.",
        })
        .trim(),
});

interface FormState {
    isSuccess: boolean;
    error: typeToFlattenedError<{ tweet: string }, string> | null;
}

export async function handleAddTweetForm(
    _: unknown,
    formData: FormData
): Promise<FormState> {
    const session = await getSession();
    const data = {
        tweet: formData.get("tweet"),
    };
    const result = await addTweetSchema.spa(data);
    if (!result.success) {
        return {
            error: result.error?.flatten(),
            isSuccess: false,
        };
    }

    const addNewTweet = await db.tweet.create({
        data: { tweet: result.data.tweet, userId: session.id! },
    });
    if (!addNewTweet) {
        return {
            error: {
                formErrors: [],
                fieldErrors: {
                    tweet: ["Error"],
                },
            },
            isSuccess: false,
        };
    }
    redirect("/");
}
