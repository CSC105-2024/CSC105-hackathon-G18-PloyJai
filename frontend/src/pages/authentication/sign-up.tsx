import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import {cn} from "@/lib/utils.ts";
import {Button, buttonVariants} from "@/components/ui/button.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormRequiredLabel,
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {toast} from "sonner";
import {useAuth} from "@/contexts/auth-context";

const FormSchema = z
    .object({
        name: z.string().min(1, "Please enter your name"),
        email: z.string().email({
            message: "Please enter a valid email address",
        }),
        password: z.string().min(8, "Please enter at least 8 characters"),
        rePassword: z.string().min(1, "Please enter a password confirmation"),
    })
    .refine((data) => data.password === data.rePassword, {
        message: "Passwords do not match",
        path: ["rePassword"],
    });

function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const {signUp, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            rePassword: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        try {
            await signUp(data.name, data.email, data.password, data.rePassword);
            toast.success("Account created successfully!");
            navigate("/");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create account. Please try again.",
            );
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white">
            <div className="mx-auto w-full max-w-xl space-y-16 px-4 py-8">
                <section className="flex flex-col items-center gap-6 text-center">
                    <h1 className="text-6xl">PloyJai</h1>
                    <p className="text-lg">Write to release, forget to Heal.</p>
                    <div className="flex w-full flex-row items-center justify-center gap-4">
                        <Link
                            to="/authentication/sign-in"
                            className={cn(
                                buttonVariants({variant: "default"}),
                                "max-w-lg flex-1",
                            )}
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/authentication/sign-up"
                            className={cn(
                                buttonVariants({variant: "secondary"}),
                                "max-w-lg flex-1",
                            )}
                        >
                            Sign up
                        </Link>
                    </div>
                </section>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full flex-1 space-y-8"
                    >
                        <div className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Name <FormRequiredLabel/>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email Address <FormRequiredLabel/>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your email address"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col items-start gap-8 md:flex-row">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem className="w-full md:flex-1/2">
                                            <FormLabel>
                                                Password <FormRequiredLabel/>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your password"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="rePassword"
                                    render={({field}) => (
                                        <FormItem className="w-full md:flex-1/2">
                                            <FormLabel>
                                                Re - Password <FormRequiredLabel/>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Confirm your password"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing up..." : "Sign up"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <span className="py-2 font-mono">
                &copy; {new Date().getFullYear()} PloyJai
            </span>
        </div>
    );
}

export default Page;
