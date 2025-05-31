import React from "react";
import { IconPencilHeart, IconPicnicTable } from "@tabler/icons-react";

function LoadingLayout() {
  return (
    <div className="animate-in flex min-h-svh flex-col items-center justify-center text-center">
      <IconPencilHeart
        className="size-32 animate-pulse"
        aria-label="Loading..."
      />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-bold">PloyJai</h1>
        <p className="font-mono">Write to release, forget to Heal.</p>
      </div>
    </div>
  );
}

export default LoadingLayout;
