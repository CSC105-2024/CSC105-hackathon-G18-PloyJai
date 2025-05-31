import React, { useState, useEffect } from "react";
import { Link, useNavigate, type NavigateFunction } from "react-router";
import { cn } from "@/lib/utils.ts";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRequiredLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input.tsx";
import { useAuth } from "@/contexts/auth-context.tsx";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, "Please enter a password"),
});

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success("Signed in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Failed to sign in. Please check your credentials.",
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
          <h1 className="text-6xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">PloyJai</h1>
          <p className="text-lg">Write to release, forget to Heal.</p>
          <div className="flex w-full flex-row items-center justify-center gap-4">
            <Link
              to="/authentication/sign-in"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "max-w-lg flex-1 ",
              )}
            >
              Sign in
            </Link>
            <Link
              to="/authentication/sign-up"
              className={cn(
                buttonVariants({ variant: "default" }),
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email Address <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <FormRequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
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
