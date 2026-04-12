import Link from "next/link";

import { Button } from "@/components/ui/button";
import { parseSingleParam } from "@/lib/guides";
import { cn } from "@/lib/utils";

const SERVICE_TYPES = [
    { value: "all", label: "All" },
    { value: "health", label: "Health" },
    { value: "food", label: "Food" },
    { value: "community", label: "Community" },
] as const;

export default async function NearMePage({
    searchParams,
}: {
    searchParams: Promise<{
        type?: string | string[];
    }>;
}) {
    const params = await searchParams;
    const selectedType = parseSingleParam(params.type) ?? "all";

    return (
        <main className="min-h-screen bg-minuri-fog px-4 py-10 md:px-8">
            <div className="mx-auto max-w-5xl rounded-[2rem] bg-minuri-white p-6 shadow-sm ring-1 ring-minuri-silver/40 md:p-8">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-minuri-teal">
                    Near Me placeholder
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-minuri-ocean md:text-5xl">
                    This is a placceholder page for the "Near Me" guide.
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-minuri-slate md:text-lg">
                    This page exists so Epic 2's guide CTA can land somewhere real.
                    Service search, maps and live results belong in Epic 3 and backend
                    proxy work belongs in Epic 4.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                    {SERVICE_TYPES.map((type) => (
                        <span
                            key={type.value}
                            className={cn(
                                "rounded-full px-4 py-2 text-sm font-medium",
                                selectedType === type.value
                                    ? "bg-minuri-teal text-primary-foreground"
                                    : "bg-minuri-mist text-minuri-slate",
                            )}
                        >
                            {type.label}
                        </span>
                    ))}
                </div>

                <div className="mt-8 rounded-[1.5rem] bg-minuri-fog p-5">
                    <p className="text-base leading-7 text-minuri-slate">
                        Current frontend state:
                    </p>
                    <p className="mt-2 text-base leading-7 text-minuri-slate">
                        The page has correctly pre-selected the{" "}
                        <strong className="text-minuri-ocean">
                            {selectedType}
                        </strong>{" "}
                        filter from the guide CTA.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild className="rounded-full px-5">
                        <Link href="/guides">Back to guides</Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full px-5">
                        <Link href="/guides/bookmarks">Go to bookmarks</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
