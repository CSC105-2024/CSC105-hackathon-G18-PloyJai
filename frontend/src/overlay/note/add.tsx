import {useModalStore} from "@/store/modal";
import {toast} from "sonner";
import {Button} from "@/components/ui/button.tsx";
import {createModalHook} from "@/hooks/use-modal.tsx";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "@/contexts/auth-context.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormRequiredLabel
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

const FormSchema = z.object({
    note: z.string().min(1, {
        message: "Your note must be at least 1 character."
    }).max(25000, {
        message: "Your note must not be longer than 25,000 characters."
    }),
});

function NoteAddOverlay() {
    const [isLoading, setIsLoading] = useState(false);
    const {signIn, isAuthenticated} = useAuth();
    const {closeModal} = useModalStore();

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            note: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        try {
            //
            toast.success("Note added successfully");
            closeModal('note-add')
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
        <div className="space-y-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex-1 space-y-8"
                >
                    <div className="space-y-8">
                        <FormField
                            control={form.control}
                            name="note"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Note <FormRequiredLabel/>
                                    </FormLabel>
                                    <div className="relative overflow-hidden rounded-md">
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us your story"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="absolute right-2 bottom-2">
                                            {Intl.NumberFormat().format(
                                                Math.max(0, 25000 - (field.value?.length || 0)),
                                            )}
                                        </FormDescription>
                                    </div>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col md;Flex-row gap-4 space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

const useNoteAddOverlay = createModalHook(
    NoteAddOverlay,
    "note-add",
    "How are you feeling today?",
    "Your note, journey and adventure will be staying with us."
);

export {useNoteAddOverlay, NoteAddOverlay};
