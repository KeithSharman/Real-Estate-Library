import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {
		// Keep module resolution rooted in this app folder in multi-workspace setups.
		root: process.cwd(),
	},
};

export default nextConfig;
