"use client";

import { useActionState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Button from "./Button";
import Input from "./Input";
import { handleSearchForm } from "@/app/search/[[...slug]]/action";

export default function Search() {
    const [state, dispatch] = useActionState(handleSearchForm, null);

    return (
        <div>
            <form action={dispatch} className="w-full flex gap-5">
                <div className="w-[500px]">
                    <Input
                        name="keyword"
                        type="text"
                        placeholder="트윗 검색하기"
                        required
                        errors={state?.error?.fieldErrors.keyword}
                        labelIcon={<MagnifyingGlassIcon />}
                    />
                </div>
                <div className="w-[100px]">
                    <Button text="검색하기" />
                </div>
            </form>
        </div>
    );
}
