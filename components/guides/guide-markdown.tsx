"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

type GuideMarkdownProps = {
	markdown: string;
	className?: string;
	paragraphClassName?: string;
};

export function GuideMarkdown({
	markdown,
	className,
	paragraphClassName,
}: GuideMarkdownProps) {
	return (
		<div className={cn("space-y-6", className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					p: ({ children }) => (
						<p
							className={cn(
								"leading-8 text-minuri-ink",
								paragraphClassName,
							)}
						>
							{children}
						</p>
					),
					strong: ({ children }) => (
						<strong className="font-bold">
							{children}
						</strong>
					),
					em: ({ children }) => <em className="italic">{children}</em>,
					a: ({ href, children }) => (
						<a
							href={href}
							target="_blank"
							rel="noreferrer"
							className="text-minuri-teal underline underline-offset-4 hover:text-minuri-ocean"
						>
							{children}
						</a>
					),
					ul: ({ children }) => (
						<ul className="ml-5 list-disc space-y-2 text-minuri-ink">
							{children}
						</ul>
					),
					ol: ({ children }) => (
						<ol className="ml-5 list-decimal space-y-2 text-minuri-ink">
							{children}
						</ol>
					),
					li: ({ children }) => (
						<li className="leading-7">
							{children}
						</li>
					),
					blockquote: ({ children }) => (
						<blockquote className="border-l-2 border-minuri-silver pl-4 text-minuri-slate">
							{children}
						</blockquote>
					),
					hr: () => <hr className="border-minuri-silver/80" />,
				}}
			>
				{markdown}
			</ReactMarkdown>
		</div>
	);
}
