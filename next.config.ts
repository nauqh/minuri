import type { NextConfig } from "next";

const csp = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
	"style-src 'self' 'unsafe-inline'",
	"font-src 'self'",
	// next/image optimises external images through /_next/image (same-origin).
	// MapLibre popup injects raw <img> tags so we still need https: in img-src.
	"img-src 'self' data: blob: https:",
	// MapLibre fetches the MapTiler style JSON and vector tiles over XHR.
	// Nominatim is called directly from the browser for reverse geocoding.
	"connect-src 'self' https://api.maptiler.com https://nominatim.openstreetmap.org https://unpkg.com https://cdn.jsdelivr.net",
	// MapLibre spawns workers via blob: URLs.
	"worker-src blob:",
	"frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{
						key: "Permissions-Policy",
						value: "geolocation=(self), camera=(), microphone=()",
					},
					{ key: "Content-Security-Policy", value: csp },
				],
			},
		];
	},

	images: {
		remotePatterns: [
			// Guide thumbnails
			{ protocol: "https", hostname: "picsum.photos" },
			{ protocol: "https", hostname: "images.unsplash.com" },
			{ protocol: "https", hostname: "plus.unsplash.com" },
			// Google CDNs — guide thumbnails and SerpAPI place thumbnails
			{ protocol: "https", hostname: "**.googleusercontent.com" },
			{ protocol: "https", hostname: "**.googleapis.com" },
			// Image proxy
			{ protocol: "https", hostname: "wsrv.nl" },
		],
	},
};

export default nextConfig;
