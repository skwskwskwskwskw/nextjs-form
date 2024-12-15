"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { typeToFlattenedError, z } from "zod";

import db from "@/lib/db";
import { isEmailExist, isUsernameExist } from "@/service/userService";
import { getSession } from "@/lib/session";

const USERNAME_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 10;

const PASSWORD_REGEX = /^(?=.*\d).{10,}$/;

const createAccountSchema = z
    .object({
        email: z
            .string({
                required_error: "Email is required.",
            })
            .trim()
            .email("Please enter a valid email address.")
            .refine(
                (email) => email.includes("@zod.com"),
                "Only @zod.com email addresses are allowed."
            ),
        username: z
            .string({
                invalid_type_error: "Username must be a string.",
                required_error: "Username is required.",
            })
            .trim()
            .min(
                USERNAME_MIN_LENGTH,
                `Username should be at least ${USERNAME_MIN_LENGTH} characters long.`
            ),
        password: z
            .string({
                required_error: "Password is required.",
            })
            .trim()
            .min(
                PASSWORD_MIN_LENGTH,
                `Password should be at least ${PASSWORD_MIN_LENGTH} characters long.`
            )
            .regex(
                PASSWORD_REGEX,
                "Password should contain at least one number (0-9)."
            ),
    })
    .superRefine(async ({ username }, ctx) => {
        const user = await isUsernameExist(username);
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "This username is already taken",
                path: ["username"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    .superRefine(async ({ email }, ctx) => {
        const user = await isEmailExist(email);
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "This email is already taken",
                path: ["email"],
                fatal: true,
            });
            return z.NEVER;
        }
    });

const editAccountSchema = z
    .object({
        email: z
            .string({
                required_error: "Email is required.",
            })
            .trim()
            .email("Please enter a valid email address.")
            .refine(
                (email) => email.includes("@zod.com"),
                "Only @zod.com email addresses are allowed."
            ),
        username: z
            .string({
                invalid_type_error: "Username must be a string.",
                required_error: "Username is required.",
            })
            .trim()
            .min(
                USERNAME_MIN_LENGTH,
                `Username should be at least ${USERNAME_MIN_LENGTH} characters long.`
            ),
        password: z
            .string({
                required_error: "Password is required.",
            })
            .trim()
            .min(
                PASSWORD_MIN_LENGTH,
                `Password should be at least ${PASSWORD_MIN_LENGTH} characters long.`
            )
            .regex(
                PASSWORD_REGEX,
                "Password should contain at least one number (0-9)."
            ),
        bio: z.string().trim(),
    })
    .superRefine(async ({ username }, ctx) => {
        const user = await isUsernameExist(username);
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "This username is already taken",
                path: ["username"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    .superRefine(async ({ email }, ctx) => {
        const user = await isEmailExist(email);
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "This email is already taken",
                path: ["email"],
                fatal: true,
            });
            return z.NEVER;
        }
    });

interface FormState {
    isSuccess: boolean;
    error: typeToFlattenedError<
        { email: string; username: string; password: string },
        string
    > | null;
}

export async function handleForm(
    _: unknown,
    formData: FormData
): Promise<FormState> {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    };
    const result = await createAccountSchema.spa(data);
    if (!result.success) {
        return {
            error: result.error?.flatten(),
            isSuccess: false,
        };
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await db.user.create({
        data: {
            email: result.data.email,
            username: result.data.username,
            password: hashedPassword,
        },
        select: {
            id: true,
        },
    });

    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/");
}

export async function handleEditForm(
    _: unknown,
    formData: FormData
): Promise<FormState> {
    const userId = Number(formData.get("userId"));
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        bio: formData.get("bio"),
    };
    const result = await editAccountSchema.spa(data);
    if (!result.success) {
        return {
            error: result.error?.flatten(),
            isSuccess: false,
        };
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    if (userId) {
        await db.user.updateMany({
            where: {
                id: userId,
            },
            data: {
                email: result.data.email,
                username: result.data.username,
                password: hashedPassword,
                bio: result.data.bio,
            },
        });
    }
    return {
        isSuccess: true,
        error: null,
    };
}
