"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PASSWORD = "minuri";
const STORAGE_KEY = "minuri-password-gate";

function findGateTarget(start: EventTarget | null): HTMLAnchorElement | null {
	if (!(start instanceof Element)) return null;
	if (start.closest("[data-password-gate-ui]")) return null;

	const anchor = start.closest("a[href]");
	if (anchor instanceof HTMLAnchorElement) {
		const href = anchor.getAttribute("href") ?? "";
		if (href === "" || href.startsWith("#")) return null;
		if (href.startsWith("javascript:")) return null;
		if (href.startsWith("mailto:") || href.startsWith("tel:")) return null;
		return anchor;
	}

	return null;
}

export function PasswordGate({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [unlocked, setUnlocked] = useState(false);
	const [promptOpen, setPromptOpen] = useState(false);
	const [pendingHref, setPendingHref] = useState<string | null>(null);
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
			const target = el ? findGateTarget(el) : null;
			if (!target) return;
			if (
				e.button !== 0 ||
				e.metaKey ||
				e.ctrlKey ||
				e.altKey ||
				e.shiftKey
			) {
				return;
			}
			const targetAttr = target.getAttribute("target");
			if (targetAttr && targetAttr !== "_self") return;
			setPendingHref(target.getAttribute("href"));
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
		if (!pendingHref) return;
		try {
			const url = new URL(pendingHref, window.location.href);
			if (url.origin === window.location.origin) {
				const destination = `${url.pathname}${url.search}${url.hash}`;
				router.push(destination);
			} else {
				window.location.assign(url.toString());
			}
		} catch {
			/* ignore invalid URL */
		}
		setPendingHref(null);
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
					<div className="min-w-0">
						<p className="text-xs font-semibold tracking-[0.12em] text-minuri-teal uppercase">
							Minuri preview
						</p>
						<h2
							id={`${formId}-title`}
							className="font-heading mt-2 text-2xl leading-snug font-semibold tracking-tight text-minuri-ocean sm:text-[1.65rem]"
						>
							{"Psst... secret door ahead"}
						</h2>
						<p
							id={`${formId}-desc`}
							className="mt-3 text-base leading-relaxed text-minuri-slate"
						>
							{
								"Browse all you want. When you're ready for the deeper goodies, drop in your invite password."
							}
						</p>
					</div>

					<form
						onSubmit={submit}
						className="mt-8 flex flex-col gap-5"
					>
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
									"border-minuri-silver/90 focus-visible:border-minuri-teal",
									error &&
										"border-minuri-coral/80 focus-visible:border-minuri-coral",
								)}
								aria-invalid={error}
								aria-describedby={`${formId}-hint${error ? ` ${formId}-err` : ""}`}
							/>
							<p
								id={`${formId}-hint`}
								className="text-sm text-minuri-slate/85"
							>
								{
									"No password yet? No drama. Close this and keep exploring."
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
									"Close! That password is playing hide-and-seek. Try once more."
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
								Enter Minuri
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
