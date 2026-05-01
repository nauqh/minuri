"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PASSWORD = "minuri";
const STORAGE_KEY = "minuri-password-gate";

function findGateTarget(start: EventTarget | null): Element | null {
	if (!(start instanceof Element)) return null;
	if (start.closest("[data-password-gate-ui]")) return null;

	const buttonLike = start.closest(
		'button, [role="button"], [data-slot="button"], input[type="submit"], input[type="button"]',
	);
	if (buttonLike) {
		if (buttonLike instanceof HTMLButtonElement && buttonLike.disabled) {
			return null;
		}
		if (buttonLike instanceof HTMLInputElement && buttonLike.disabled) {
			return null;
		}
		if (buttonLike.getAttribute("aria-disabled") === "true") {
			return null;
		}
		return buttonLike;
	}

	const anchor = start.closest("a[href]");
	if (anchor instanceof HTMLAnchorElement) {
		const href = anchor.getAttribute("href") ?? "";
		if (href === "" || href.startsWith("#")) return null;
		if (href.startsWith("javascript:")) return null;
		return anchor;
	}

	return null;
}

export function PasswordGate({ children }: { children: React.ReactNode }) {
	const [unlocked, setUnlocked] = useState(false);
	const [promptOpen, setPromptOpen] = useState(false);
	const formId = useId();
	const gateRootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		try {
			if (sessionStorage.getItem(STORAGE_KEY) === "1") {
				setUnlocked(true);
			}
		} catch {
			/* ignore */
		}
	}, []);

	const gateClick = useCallback(
		(e: MouseEvent) => {
			if (unlocked) return;
			const node = e.target;
			if (!(node instanceof Node)) return;
			if (!gateRootRef.current?.contains(node)) return;
			const el = node instanceof Element ? node : node.parentElement;
			if (!el || !findGateTarget(el)) return;
			e.preventDefault();
			e.stopPropagation();
			setPromptOpen(true);
		},
		[unlocked],
	);

	useEffect(() => {
		if (unlocked) return;
		document.addEventListener("click", gateClick, true);
		return () => document.removeEventListener("click", gateClick, true);
	}, [unlocked, gateClick]);

	useEffect(() => {
		if (!promptOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setPromptOpen(false);
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [promptOpen]);

	function unlock() {
		try {
			sessionStorage.setItem(STORAGE_KEY, "1");
		} catch {
			/* ignore */
		}
		setUnlocked(true);
		setPromptOpen(false);
	}

	return (
		<>
			<div ref={gateRootRef} className={cn("flex flex-1 flex-col")}>
				{children}
			</div>
			{promptOpen && typeof document !== "undefined"
				? createPortal(
						<PasswordPromptDialog
							formId={formId}
							onUnlock={unlock}
							onDismiss={() => setPromptOpen(false)}
						/>,
						document.body,
					)
				: null}
		</>
	);
}

function PasswordPromptDialog({
	formId,
	onUnlock,
	onDismiss,
}: {
	formId: string;
	onUnlock: () => void;
	onDismiss: () => void;
}) {
	const [value, setValue] = useState("");
	const [error, setError] = useState(false);

	function submit(e: React.FormEvent) {
		e.preventDefault();
		if (value === PASSWORD) {
			setError(false);
			onUnlock();
			return;
		}
		setError(true);
	}

	return (
		<div
			className={cn(
				"fixed inset-0 z-10000 flex items-center justify-center",
				"bg-minuri-ocean/78 backdrop-blur-md",
				"p-5 sm:p-8",
			)}
			data-password-gate-ui
			role="dialog"
			aria-modal="true"
			aria-labelledby={`${formId}-title`}
			aria-describedby={`${formId}-desc`}
		>
			<div
				className="absolute inset-0 cursor-default"
				aria-hidden
				onClick={onDismiss}
			/>
			<div
				className={cn(
					"relative w-full max-w-2xl overflow-hidden rounded-(--minuri-container-radius)",
					"border border-minuri-teal/25 bg-minuri-white shadow-[0_28px_80px_-28px_color-mix(in_oklch,var(--minuri-ocean)_55%,transparent)]",
					"text-minuri-ocean",
				)}
			>
				<div
					className="h-1.5 bg-linear-to-r from-minuri-teal via-minuri-seafoam to-minuri-sky"
					aria-hidden
				/>
				<div className="px-8 py-9 sm:px-10 sm:py-10">
					<div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
						<div
							className={cn(
								"flex size-14 shrink-0 items-center justify-center self-start rounded-2xl",
								"bg-minuri-mint/35 text-minuri-teal",
								"shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--minuri-white)_65%,transparent)]",
							)}
							aria-hidden
						>
							<Heart className="size-7 fill-minuri-teal/15 stroke-2" strokeLinecap="round" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-xs font-semibold tracking-[0.12em] text-minuri-teal uppercase">
								Minuri preview
							</p>
							<h2
								id={`${formId}-title`}
								className="font-heading mt-2 text-2xl leading-snug font-semibold tracking-tight text-minuri-ocean sm:text-[1.65rem]"
							>
								{"Glad you're exploring — here's a gentle pause"}
							</h2>
							<p
								id={`${formId}-desc`}
								className="mt-3 text-base leading-relaxed text-minuri-slate"
							>
								{
									"Take your time scrolling and reading: everything on the page is yours to browse. When you're ready to open guides, maps, or next steps, pop in the invite password we shared — it keeps this space calm for the community we're building."
								}
							</p>
						</div>
					</div>

					<form onSubmit={submit} className="mt-8 flex flex-col gap-5">
						<div className="flex flex-col gap-2">
							<label
								htmlFor={`${formId}-password`}
								className="text-sm font-medium text-minuri-ocean"
							>
								Invite password
							</label>
							<input
								id={`${formId}-password`}
								type="password"
								name="password"
								autoComplete="current-password"
								autoFocus
								placeholder="Enter your password"
								value={value}
								onChange={(e) => {
									setValue(e.target.value);
									if (error) setError(false);
								}}
								className={cn(
									"h-12 w-full rounded-[min(var(--radius-md),12px)] border bg-minuri-fog/80 px-4 text-base",
									"text-minuri-ocean placeholder:text-minuri-slate/55 outline-none transition-colors",
									"border-minuri-silver/90 focus-visible:border-minuri-teal focus-visible:ring-4 focus-visible:ring-minuri-teal/25",
									error &&
										"border-minuri-coral/80 focus-visible:border-minuri-coral focus-visible:ring-minuri-coral/20",
								)}
								aria-invalid={error}
								aria-describedby={`${formId}-hint${error ? ` ${formId}-err` : ""}`}
							/>
							<p id={`${formId}-hint`} className="text-sm text-minuri-slate/85">
								{
									"If you don't have it yet, no stress — you can close this and keep reading."
								}
							</p>
						</div>
						{error ? (
							<p
								id={`${formId}-err`}
								className="rounded-lg bg-minuri-coral/12 px-3 py-2 text-sm font-medium text-minuri-coral"
								role="alert"
							>
								{
									"Not quite — double-check the password and try again. We're here when you're ready."
								}
							</p>
						) : null}
						<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
							<Button
								type="button"
								variant="outline"
								className={cn(
									"h-11 w-full border-minuri-silver/90 bg-transparent text-minuri-ocean sm:w-auto sm:min-w-38",
									"hover:bg-minuri-mist/40",
								)}
								onClick={onDismiss}
							>
								Keep browsing
							</Button>
							<Button
								type="submit"
								className={cn(
									"h-11 w-full bg-minuri-teal text-primary-foreground hover:bg-minuri-teal/90 sm:w-auto sm:min-w-44",
								)}
							>
								Unlock & continue
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
