"use server";

import { z } from "zod";

// const passwordRegex = new RegExp(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
// );
// 1개 이상의 숫자 포함
const passwordRegex = new RegExp(/\d+/);
const emailRegex = new RegExp(/@zod\.com$/);

const formSchema = z.object({
    email: z
        .string()
        .email()
        .toLowerCase()
        .regex(emailRegex, "Only @zod.com emails are allowed"),
    username: z
        .string({
            invalid_type_error: "Username must be a string!",
            required_error: "Where is my username???",
        })
        .min(5, "Username should be at least 5 characters long.")
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(10, "Password should be at least 10 characters long.")
        .regex(
            passwordRegex,
            "Password should contain at least one number(0123456789)."
        ),
});

export async function handleForm(prevState: any, formData: FormData) {
    const data = {
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
    };
    const result = formSchema.safeParse(data);
    if (!result.success) {
        return {
            success: false,
            error: result.error.flatten(),
        };
    } else {
        return {
            success: true,
        };
    }
}
