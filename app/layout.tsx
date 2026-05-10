import type { Metadata } from "next";
import { Caveat, Fraunces, Inter } from "next/font/google";
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

const caveat = Caveat({
	subsets: ["latin"],
	variable: "--font-handwriting",
	weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://www.minuri.tech"),
	title: "Minuri | Your guide to settling in Melbourne",
	description:
		"Practical guides, local maps, and a personalised week plan for young adults starting out in Melbourne.",
	icons: {
		icon: "https://cdn-icons-png.flaticon.com/512/6959/6959474.png",
	},
	openGraph: {
		title: "Minuri | Your guide to settling in Melbourne",
		description:
			"Practical guides, local maps, and a personalised week plan for young adults starting out in Melbourne.",
		url: "https://www.minuri.tech",
		siteName: "Minuri",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Minuri — Your guide to settling in Melbourne",
			},
		],
		locale: "en_AU",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Minuri | Your guide to settling in Melbourne",
		description:
			"Practical guides, local maps, and a personalised week plan for young adults starting out in Melbourne.",
		images: ["/og-image.png"],
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
				caveat.variable,
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
