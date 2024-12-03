import { InputHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

interface InputProps {
    name: string;
    errors?: string[];
    labelIcon?: ReactNode;
}

export default function Input({
    name,
    errors,
    labelIcon,
    ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
    const { pending } = useFormStatus();
    console.log(errors);
    console.log(errors ? true : false);
    return (
        <div className="flex flex-col gap-2">
            <div className="relative flex">
                <label
                    htmlFor={name}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-600 *:size-5"
                >
                    {labelIcon}
                </label>
                <input
                    id={name}
                    name={name}
                    className={`w-full h-12 pl-11 rounded-xl bg-transparent text-stone-600 border placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-offset-2 transition ${
                        errors
                            ? "border-red-500 focus:ring-red-400"
                            : "border-stone-400 focus:ring-stone-300"
                    }`}
                    disabled={pending}
                    {...rest}
                />
            </div>
            <div>
                {errors?.map((error, index) => (
                    <span key={index} className="text-red-500 font-medium">
                        {error}
                    </span>
                ))}
            </div>
        </div>
    );
}
