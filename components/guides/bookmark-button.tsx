"use client";

import { Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BookmarkButtonProps = {
    active: boolean;
    onToggle: () => void;
    className?: string;
};

export function BookmarkButton({
    active,
    onToggle,
    className,
}: BookmarkButtonProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-pressed={active}
            aria-label={active ? "Remove bookmark" : "Save guide"}
            className={cn(
                "size-11 rounded-full border border-minuri-silver/80 bg-minuri-white text-minuri-slate hover:bg-minuri-mist",
                active && "border-minuri-teal/50 text-minuri-teal",
                className,
            )}
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onToggle();
            }}
        >
            <Bookmark
                className={cn("size-5", active && "fill-current")}
                aria-hidden="true"
            />
        </Button>
    );
}
