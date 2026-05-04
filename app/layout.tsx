import type { Metadata } from "next";
import {
	Fraunces,
	Inter,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/app-shell";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { VibeProvider } from "@/components/vibe-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fraunces = Fraunces({
	subsets: ["latin"],
	variable: "--font-hero-serif",
});

export const metadata: Metadata = {
	title: "Your guides for living independently | Minuri",
	description:
		"Proactive wellbeing for young adults living independently: reminders, guides, habits, and Care Circle.",
	icons: {
		icon: "https://cdn-icons-png.flaticon.com/512/6959/6959474.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			data-scroll-behavior="lenis"
			className={cn(
				"h-full",
				"antialiased",
				fraunces.variable,
				"font-sans",
				inter.variable,
			)}
		>
			<body className="min-h-full flex flex-col">
					<AppShell>
						<SmoothScrollProvider>
							<VibeProvider>{children}</VibeProvider>
						</SmoothScrollProvider>
					</AppShell>
				</body>
		</html>
	);
}
