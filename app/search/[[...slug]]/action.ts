"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const searchKeywordSchema = z.object({
    keyword: z
        .string({
            required_error: "Search Keyword is required.",
        })
        .trim(),
});

export async function handleSearchForm(_: unknown, formData: FormData) {
    const data = {
        keyword: formData.get("keyword"),
    };
    const result = await searchKeywordSchema.spa(data);
    if (!result.success) {
        return {
            error: result.error?.flatten(),
            isSuccess: false,
        };
    }
    const encodedKeyword = encodeURIComponent(result.data.keyword);
    redirect(`/search/${encodedKeyword}`);
}
