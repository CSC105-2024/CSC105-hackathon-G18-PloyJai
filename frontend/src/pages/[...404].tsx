import React from "react";
import {NavLink} from "react-router";
import {cn} from "@/lib/utils.js";
import {buttonVariants} from "@/components/ui/button.jsx";
import {IconArrowNarrowLeft} from "@tabler/icons-react";

function Page() {
    return (
        <div
            data-status="404"
            className="min-h-screen bg-[#fffaf3] flex flex-col items-center justify-center px-4 py-12 text-center space-y-8"
        >
            <div className="space-y-2">
                <h1 className="text-6xl font-bold">404</h1>
                <p className="text-xl font-medium">Oops! Page Not Found</p>
                <p className="text-sm  max-w-md">
                    The page you’re looking for doesn’t exist. Maybe it moved, or maybe it never existed.
                </p>
            </div>

            <NavLink
                to="/"
                className={cn(
                    buttonVariants(),
                    "mt-4 px-6 py-2 text-white text-sm font-semibold transition-all",
                    "font-mono"
                )}
            >
                <IconArrowNarrowLeft/> Back to Home
            </NavLink>
        </div>
    );
}

export default Page;